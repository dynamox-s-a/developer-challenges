from typing import Any

from pydantic import BaseModel


class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Any | None = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "error": "TIMESERIES_NOT_FOUND",
                    "message": "Time series with id abc-123 not found",
                    "details": None,
                },
                {
                    "error": "TIMESERIES_DATA_EMPTY",
                    "message": "Time series must contain at least one data point",
                    "details": None,
                },
                {
                    "error": "VALIDATION_ERROR",
                    "message": "Request body is invalid",
                    "details": [{"field": "data", "issue": "List must not be empty"}],
                },
                {
                    "error": "TIMESERIES_DUPLICATE_TIMESTAMP",
                    "message": "A data point with this timestamp already exists in the series",
                    "details": None,
                },
                {
                    "error": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected internal server error occurred",
                    "details": None,
                },
            ]
        }
    }
