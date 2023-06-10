from enum import Enum
from typing import List
from pydantic import BaseModel, EmailStr, Field
from passlib.hash import bcrypt
from bson import ObjectId

class Role(str, Enum):
    ADM = "ADM"
    QA  = "QA"
    FE  = "FE"
    BE  = "BE"

class User(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    permission: List[str]
    role: Role
