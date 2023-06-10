from enum import Enum
from typing import List
from pydantic import BaseModel

class Feature(BaseModel):
    name: str
