from pydantic import BaseModel, Field, validator
from typing import Optional, Union
from enum import Enum
from datetime import date
from bson import ObjectId
from models.user import UserResponseModel
from models.feature import FeatureResponseModel


class IssueSeverityEnum(str, Enum):
    MAJOR        = "MAJOR"
    MINOR        = "MINOR"
    BLOCKING     = "BLOCKING"
    MODERATE     = "MODERATE"
    LOCALIZATION = "LOCALIZATION"


class IssueDevTypeEnum(str, Enum):
    FE = "FE"
    BE = "BE"


class IssueStatusEnum(str, Enum):
    OPEN        = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    DEV_DONE    = "DEV_DONE"
    FAIL        = "FAIL"
    PASS        = "PASS"
    NAB         = "NAB"


class IssueCreateModel(BaseModel):
    ref           : str
    feature_id    : ObjectId
    description   : str
    severity      : IssueSeverityEnum
    reported_date : date
    due_date      : Optional[date] = None
    reporter_id   : ObjectId
    status        : Union[IssueStatusEnum,  None] = IssueStatusEnum.OPEN
    dev_type      : Union[IssueDevTypeEnum, None] = None
    dev_id        : Optional[ObjectId] = None
    dev_eta       : Optional[int] = None
    dev_actual    : Optional[int] = None
    qa_id         : Optional[ObjectId] = None
    qa_eta        : Optional[int] = None
    qa_actual     : Optional[int] = None

    @validator("feature_id", pre=True)
    def convert_id(cls, value):
        return ObjectId(value)
    
    @validator("reporter_id", pre=True)
    def convert_reporter_id(cls, value):
        return ObjectId(value)

    @validator("dev_id", pre=True)
    def convert_dev_id(cls, value):
        if not value: return None
        return ObjectId(value)

    @validator('qa_id', pre=True)
    def convert_qa_id(cls, value):
        if not value: return None
        return ObjectId(value)
    
    class Config:
        arbitrary_types_allowed = True


class IssueUpdateModel(BaseModel):
    ref           : Optional[str] = None
    feature_id    : Optional[ObjectId] = None
    description   : Optional[str] = None
    severity      : Union[IssueSeverityEnum, None] = None
    reported_date : Optional[date] = None
    due_date      : Optional[date] = None
    reporter_id   : Optional[ObjectId]  = None
    status        : Union[IssueStatusEnum,  None] = None
    dev_type      : Union[IssueDevTypeEnum, None] = None
    dev_id        : Optional[ObjectId] = None
    dev_eta       : Optional[int] = None
    dev_actual    : Optional[int] = None
    qa_id         : Optional[ObjectId] = None
    qa_eta        : Optional[int] = None
    qa_actual     : Optional[int] = None

    @validator("feature_id", pre=True)
    def convert_id(cls, value):
        if not value: return None
        return ObjectId(value)
    
    @validator("reporter_id", pre=True)
    def convert_reporter_id(cls, value):
        if not value: return None
        return ObjectId(value)

    @validator("dev_id", pre=True)
    def convert_dev_id(cls, value):
        if not value: return None
        return ObjectId(value)

    @validator('qa_id', pre=True)
    def convert_qa_id(cls, value):
        if not value: return None
        return ObjectId(value)
    
    class Config:
        arbitrary_types_allowed = True


class IssueResponseModel(BaseModel):
    id            : str = Field(alias="_id")
    ref           : str
    feature       : FeatureResponseModel
    description   : str
    severity      : IssueSeverityEnum
    reported_date : date
    due_date      : Optional[date] = None
    reporter      : UserResponseModel
    status        : Union[IssueStatusEnum,  None] = None
    dev_type      : Union[IssueDevTypeEnum, None] = None
    dev           : Optional[UserResponseModel] = None
    dev_eta       : Optional[int] = None
    dev_actual    : Optional[int] = None
    qa            : Optional[UserResponseModel] = None
    qa_eta        : Optional[int] = None
    qa_actual     : Optional[int] = None

