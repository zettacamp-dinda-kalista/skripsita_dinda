from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from enum import Enum
from bson import ObjectId
from utils.hash import Hash


class UserRoleEnum(str, Enum):
    ADM = "ADMIN"
    QA = "QA"
    FE = "FE"
    BE = "BE"


class UserCreateModel(BaseModel):
    email       : EmailStr
    first_name  : str
    last_name   : str
    password    : str
    feature_ids : List[ObjectId]
    role        : UserRoleEnum

    @validator('password', pre=True)
    def hash_password(cls, value):
        return Hash.bcrypt(value)

    @validator('feature_ids', pre=True)
    def convert_feature_ids(cls, value):
        for i in range(len(value)):
            if isinstance(value[i], str):
                value[i] = ObjectId(value[i])

        return value
    
    class Config:
        arbitrary_types_allowed = True


class UserUpdateModel(BaseModel):
    email       : Optional[EmailStr]     = None
    first_name  : Optional[str]          = None
    last_name   : Optional[str]          = None
    password    : Optional[str]          = None
    feature_ids : Optional[List[str]]    = None
    role        : Optional[UserRoleEnum] = None

    @validator('password', pre=True)
    def hash_password(cls, value):
        if not value: return None
        return Hash.bcrypt(value)
    
    @validator('feature_ids', pre=True)
    def convert_feature_ids(cls, value):
        if not value: return None

        for i in range(len(value)):
            if isinstance(value[i], str):
                value[i] = ObjectId(value[i])

        return value
    
    class Config:
        arbitrary_types_allowed = True


class UserResponseModel(BaseModel):
    id          : str = Field(alias="_id")
    email       : EmailStr
    first_name  : str
    last_name   : str
    feature_ids : List[str] = []
    role        : UserRoleEnum

    @validator('id', pre=True)
    def convert_id(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        
        return value
    
    @validator('feature_ids', pre=True)
    def convert_feature_ids(cls, value):
        for i in range(len(value)):
            if isinstance(value[i], ObjectId):
                value[i] = str(value[i])

        return value
