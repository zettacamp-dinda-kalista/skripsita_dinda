from pydantic import BaseModel, Field
from typing import List, Optional

class FeatureCreateModel(BaseModel):
    name: str

class FeatureUpdateModel(BaseModel):
    name: Optional[str] = None

class FeatureResponseModel(BaseModel):
    id: str = Field(alias="_id")
    name: Optional[str] = None
