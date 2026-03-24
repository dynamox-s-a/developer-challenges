from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "TimeSeries API"
    app_version: str = "1.0.0"
    debug: bool = False

    database_url: str = "sqlite+aiosqlite:///./timeseries.db"

    api_v1_prefix: str = "/api/v1"

    # just a safeguard, probably won't hit this in practice
    max_series_points: int = 1_000_000

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
