"""Custom exceptions and HTTP response handling."""
from fastapi import Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base application exception with status code and message."""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(AppException):
    """Resource not found (404)."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)


class ValidationError(AppException):
    """Validation error (422)."""

    def __init__(self, message: str = "Validation error"):
        super().__init__(message=message, status_code=422)
