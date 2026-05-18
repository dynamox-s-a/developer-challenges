from fastapi import HTTPException
from sqlalchemy.orm import Session  
from datetime import datetime, timezone 

class DomainException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class ValidationException(DomainException):
    def __init__(self, message: str):
        super().__init__(message, 400)


class NotFoundException(DomainException):
    def __init__(self, message: str):
        super().__init__(message, 404)


class DuplicateDataException(DomainException):
    def __init__(self, message: str):
        super().__init__(message, 409)


class FutureTimestampException(DomainException):
    def __init__(self, message: str):
        super().__init__(message, 400)        