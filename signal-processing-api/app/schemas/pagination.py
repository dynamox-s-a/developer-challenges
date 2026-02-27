from ast import pattern

from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Optional
from datetime import datetime

T = TypeVar("T")

class PaginatedParams(BaseModel):
    limit: int = Field(50, ge=1, le=1000)
    offset: int = Field(0, ge=0)
    order: str = Field("desc", pattern="^(asc|desc)$")

class PaginatedResponseSchema(BaseModel, Generic[T]):
    limit: int
    offset: int
    total: Optional[int] = None
    has_next: bool
    has_previous: bool = Field(default=False)
    next_offset: Optional[int] = None
    previous_offset: Optional[int] = None
    data: List[T]

    class Config:
        from_attributes = True

class TimeRangeParams(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None