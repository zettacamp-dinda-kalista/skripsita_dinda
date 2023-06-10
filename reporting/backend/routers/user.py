from fastapi import APIRouter, Body, Request, Response, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pymongo.errors import DuplicateKeyError
from typing import List, Optional
from bson import ObjectId
from utils.hash import Hash
from models.user import UserCreateModel, UserUpdateModel, UserResponseModel

router = APIRouter(prefix="/user")

########################### Create user
@router.post("/", response_description="Create new user", status_code=status.HTTP_201_CREATED, response_model=UserResponseModel)
def create_user(request: Request, user: UserCreateModel = Body(...)):
    try:
        user = user.dict()
        new_user = request.app.database["users"].insert_one(user)

        created_user = request.app.database["users"].find_one(
            {"_id": new_user.inserted_id},
            {"password": 0}
        )

        return created_user

    except DuplicateKeyError as error:
        raise HTTPException(status_code=409, detail="User already exist!")

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Update user
@router.put("/{id}", response_description="Update user", response_model=UserResponseModel, response_model_exclude_unset=True)
def update_user(id: str, request: Request, user: Optional[UserUpdateModel] = Body(None)):
    try:
        update_result = request.app.database["users"].update_one(
            {"_id": ObjectId(id)},
            {"$set": user.dict(exclude_unset=True)}
        )

        if update_result.modified_count != 1:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "User not found!"}))

        updated_user = request.app.database["users"].find_one(
            {"_id": ObjectId(id)},
            {"password": 0}
        )

        return updated_user

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


########################### Get all users
@router.get("/", response_description="Get all users", response_model=List[UserResponseModel])
def get_all_user(request: Request):
    try:
        users = list(request.app.database["users"].find(
            { }, {"password": 0}
        ))
        
        return users

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Get one user
@router.get("/{id}", response_description="Get one user", response_model=UserResponseModel)
def get_one_user(id: str, request: Request):
    try:
        user = request.app.database["users"].find_one(
            {"_id": ObjectId(id)}, {"password": 0}
        )

        if user is None:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "User not found!"}))
        
        return user
    
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Delete user
@router.delete("/{id}", response_description="Delete user")
def delete_user(id: str, request: Request, response: Response):
    try:
        delete_result = request.app.database["users"].delete_one(
            {"_id": ObjectId(id)}
        )

        if delete_result.deleted_count != 1:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "User not found!"}))

        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
