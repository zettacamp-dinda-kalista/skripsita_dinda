from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union
from enum import Enum
from datetime import date
from bson import ObjectId


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
    def convert_id(cls, value):
        return ObjectId(value)

    @validator("dev_id", pre=True)
    def convert_id(cls, value):
        return ObjectId(value)

    @validator('qa_id', pre=True)
    def convert_id(cls, value):
        return ObjectId(value)


class IssueUpdateModel(BaseModel):
    ref           : Optional[str] = None
    feature_id    : Optional[str] = None
    description   : Optional[str] = None
    severity      : Union[IssueSeverityEnum, None] = None
    reported_date : Optional[date] = None
    due_date      : Optional[date] = None
    reporter_id   : Optional[str]  = None
    status        : Union[IssueStatusEnum,  None] = None
    dev_type      : Union[IssueDevTypeEnum, None] = None
    dev_id        : Optional[str] = None
    dev_eta       : Optional[int] = None
    dev_actual    : Optional[int] = None
    qa_id         : Optional[str] = None
    qa_eta        : Optional[int] = None
    qa_actual     : Optional[int] = None


class IssueResponseModel(BaseModel):
    id            : str = Field(alias="_id")
    ref           : str
    feature_id    : str
    description   : str
    severity      : IssueSeverityEnum
    reported_date : date
    due_date      : date
    reporter_id   : str
    status        : Union[IssueStatusEnum,  None] = None
    dev_type      : Union[IssueDevTypeEnum, None] = None
    dev_id        : str
    dev_eta       : int
    dev_actual    : int
    qa_id         : str
    qa_eta        : int
    qa_actual     : int

