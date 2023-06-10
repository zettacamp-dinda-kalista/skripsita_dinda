from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from models.feature import Feature
from bson import ObjectId

import json

router = APIRouter(prefix = "/feature")

# Create new user

@router.post("/", response_description = "Create a new feature", status_code = status.HTTP_201_CREATED)
def create_user(request: Request, feature: Feature = Body(...)):
    try:
        feature = jsonable_encoder(feature)
        new_feature = request.app.database["features"].insert_one(feature)

        created_feature = request.app.database["features"].find_one(
            { "_id" : new_feature.inserted_id }
        )

        return json.loads(json.dumps(created_feature, default = str))

    except Exception as error:
        return error

# Update feature

@router.put("/{id}", response_description = "Update feature")
def update_user(id: str, request: Request, feature: Feature = Body(...)):
    try:
        feature = jsonable_encoder(feature)
        update_result = request.app.database["features"].update_one(
            { "_id": ObjectId(id) }, { "$set": feature }
        )

        return json.loads(json.dumps(update_result, default = str))

    except Exception as error:
        return error

# Get all feature

@router.get("/", response_description = "Get all feature")
def get_all_user(request: Request):
    features = list(request.app.database["features"].find())
    return json.loads(json.dumps(features, default = str))

# Get one feature by id

@router.get("/{id}", response_description = "Get a single feature by id")
def get_one_user(id: str, request: Request):
    feature = request.app.database["features"].find_one(
        { "_id" : ObjectId(id) }
    )

    return json.loads(json.dumps(feature, default = str))

# Delete user

@router.delete("/{id}", response_description = "Delete a feature")
def delete_user(id: str, request: Request, response: Response):
    delete_result = request.app.database["features"].delete_one(
        { "_id": ObjectId(id) }
    )

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"User with ID {id} not found")
