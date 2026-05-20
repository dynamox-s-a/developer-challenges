from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException
from app.core.exceptions import DomainException


def domain_exception_handler(request: Request, exc: DomainException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.message,
            "error_code": exc.__class__.__name__
        }
    )


def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Invalid request payload",
            "error_code": "ValidationError",
            "details": jsonable_encoder(exc.errors())
        }
    )


def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "error_code": "HttpError"
        }
    )
