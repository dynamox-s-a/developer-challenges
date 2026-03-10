from fastapi import APIRouter

from .signal_router import router as signal_router

v1_router = APIRouter()

# Equivalente a v1_bp.register_blueprint(auth_bp, url_prefix='/auth')
v1_router.include_router(signal_router, prefix="/signal", tags=["signal"])
# v1_router.include_router(predictions_router, prefix="/predictions", tags=["predictions"])