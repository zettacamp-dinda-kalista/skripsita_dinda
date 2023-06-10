from pydantic import BaseModel, EmailStr


class AuthLoginRequest(BaseModel):
    email: EmailStr
    password: str
