from fastapi import APIRouter, Body, Request, Response, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
from models.feature import FeatureCreateModel, FeatureUpdateModel, FeatureResponseModel

router = APIRouter(prefix="/feature")

########################### Create feature
@router.post("/", response_description="Create new feature", status_code=status.HTTP_201_CREATED, response_model=FeatureResponseModel)
def create_feature(request: Request, feature: FeatureCreateModel = Body(...)):
    try:
        new_feature = request.app.database["features"].insert_one(feature.dict())

        created_feature = request.app.database["features"].find_one(
            {"_id": new_feature.inserted_id}
        )

        # convert ObjectId to string
        created_feature["_id"] = str(created_feature["_id"])
        return created_feature

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Update feature
@router.put("/{id}", response_description="Update feature", response_model=FeatureResponseModel)
def update_feature(id: str, request: Request, feature: Optional[FeatureUpdateModel] = Body(None)):
    try:
        update_result = request.app.database["features"].update_one(
            {"_id": ObjectId(id)},
            {"$set": feature.dict(exclude_unset=True)}
        )

        if update_result.modified_count != 1:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "Feature not found!"}))

        updated_feature = request.app.database["features"].find_one(
            {"_id": ObjectId(id)}
        )

        # convert ObjectId to string
        updated_feature["_id"] = str(updated_feature["_id"])
        return updated_feature

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


########################### Get all features
@router.get("/", response_description="Get all features", response_model=List[FeatureResponseModel])
def get_all_feature(request: Request):
    try:
        features = list(request.app.database["features"].find({}))

        # convert ObjectId to string
        for feature in features:
            feature["_id"] = str(feature["_id"])
        
        return features

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Get one feature
@router.get("/{id}", response_description="Get one feature", response_model=FeatureResponseModel)
def get_one_feature(id: str, request: Request):
    try:
        feature = request.app.database["features"].find_one(
            {"_id": ObjectId(id)}
        )

        if feature is None:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "Feature not found!"}))

        # convert ObjectId to string
        feature["_id"] = str(feature["_id"])
        return feature
    
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Delete feature
@router.delete("/{id}", response_description="Delete feature")
def delete_feature(id: str, request: Request, response: Response):
    try:
        delete_result = request.app.database["features"].delete_one(
            {"_id": ObjectId(id)}
        )

        if delete_result.deleted_count != 1:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "Feature not found!"}))

        # remove feature id from user's permission
        request.app.database["users"].update_many({}, {"$pull": {"permission": id}})

        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
