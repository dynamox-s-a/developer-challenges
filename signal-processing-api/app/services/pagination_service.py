from datetime import datetime

from sqlalchemy.orm import Query
from typing import Tuple, Any, Optional
from app.schemas.pagination import PaginatedResponseSchema

class PaginationService:
    @staticmethod
    def paginate(
        query: Query, 
        limit: int, 
        offset: int,
        schema_class: Any = None,
        count_total: bool = True
    ) -> dict:
        
        items = query.offset(offset).limit(limit + 1).all()

        has_next = len(items) > limit
        data = items[:limit]

        # serialize data if schema_class is provided
        if schema_class:
            data = [schema_class.model_validate(item) for item in data]

        result = {
            "limit": limit,
            "offset": offset,
            "has_next": has_next,
            "has_previous": offset > 0,
            "next_offset": offset + limit if has_next else None,
            "previous_offset": offset - limit if offset > 0 else None,
            "data": data
        }

        if count_total:
            result["total"] = query.count()

        return result
    
    @staticmethod
    def apply_time_range_filter(
        query: Query, 
        model_class: Any, 
        start_time: Optional[datetime], 
        end_time: Optional[datetime]
    ) -> Query:
        if start_time:
            query = query.filter(getattr(model_class, timestamp) >= start_time)
        if end_time:
            query = query.filter(getattr(model_class, timestamp) <= end_time)
        return query
