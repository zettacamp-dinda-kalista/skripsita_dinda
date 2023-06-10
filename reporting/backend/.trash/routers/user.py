from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from models.user import User
from utils.hash import Hash
from bson import ObjectId

import json

router = APIRouter(prefix = "/user")

# Create new user

@router.post("/", response_description = "Create a new user", status_code = status.HTTP_201_CREATED)
def create_user(request: Request, user: User = Body(...)):
    try:
        user = jsonable_encoder(user)
        user["password"] = Hash.bcrypt(user["password"])
        new_user = request.app.database["users"].insert_one(user)

        created_user = request.app.database["users"].find_one(
            { "_id" : new_user.inserted_id },
            { "password": 0 }
        )

        return json.loads(json.dumps(created_user, default = str))

    except Exception as error:
        return error

# Update user

@router.put("/{id}", response_description = "Update user")
def update_user(id: str, request: Request, user: User = Body(...)):
    try:
        user = jsonable_encoder(user)
        new_user = request.app.database["users"].insert_one(user)

        return json.loads(json.dumps(created_user, default = str))

    except Exception as error:
        return error

# Get all user

@router.get("/", response_description = "Get all user")
def get_all_user(request: Request):
    users = list(request.app.database["users"].find())
    
    for user in users:
        del user["password"]

    return json.loads(json.dumps(users, default = str))

# Get one user by id

@router.get("/{id}", response_description = "Get a single user by id")
def get_one_user(id: str, request: Request):
    user = request.app.database["users"].find_one(
        { "_id" : ObjectId(id) },
        { "password": 0 }
    )

    return json.loads(json.dumps(user, default = str))

# Delete user

@router.delete("/{id}", response_description = "Delete a user")
def delete_user(id: str, request: Request, response: Response):
    delete_result = request.app.database["users"].delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"User with ID {id} not found")
