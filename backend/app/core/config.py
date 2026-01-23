import os
from urllib.parse import urlparse
from typing import List
from pydantic import field_validator, computed_field, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Dynamox Challenge"
    DATABASE_URL: str
    SECRET_KEY: str
    ENVIRONMENT: str = "development"
    RAILWAY_ENVIRONMENT_NAME: str | None = None

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    ORIGINS: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @computed_field
    @property
    def is_production(self) -> bool:
        if self.ENVIRONMENT.lower() == "production":
            return True
        
        if self.RAILWAY_ENVIRONMENT_NAME and self.RAILWAY_ENVIRONMENT_NAME.lower() == "production":
            return True
        
        return False
        
    @field_validator("ORIGINS", mode="before")
    @classmethod
    def validate_and_parse_origins(cls, v: str, info: ValidationInfo) -> List[str]:
        env = info.data.get("ENVIRONMENT", "").lower()
        railway = info.data.get("RAILWAY_ENVIRONMENT_NAME")
        is_prod = env == "production" or railway is not None

        if not v:
            if is_prod:
                raise ValueError("ORIGINS é obrigatório em produção")
            return "http://localhost:5173"

        parsed = urlparse(v)

        if "*" in v:
            raise ValueError(f"Wildcard '*' não permitido: {v}")

        if parsed.scheme not in ["http", "https"] or not parsed.netloc:
            raise ValueError(f"Origem invalida: {v}")
        
        is_local = "localhost" in parsed.netloc or "127.0.0.1" in parsed.netloc
        if is_prod and parsed.scheme != "https" and not is_local:
            raise ValueError(f"Prod requer HTTPS: {v}")

        return v

settings = Settings()