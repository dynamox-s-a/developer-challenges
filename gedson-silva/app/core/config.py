from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite://./timeseries.db"
    APP_ENV: str = "development"

    class ConfigDict:
        env_file = ".env"

settings = Settings()