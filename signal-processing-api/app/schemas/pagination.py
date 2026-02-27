from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar("T")

class PaginatedResponseSchema(BaseModel, Generic[T]):
    limit: int
    offset: int
    has_next: bool
    data: list[T]
