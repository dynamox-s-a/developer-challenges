from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.exceptions import DomainException


def domain_exception_handler(request: Request, exc: DomainException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.message
        }
    )