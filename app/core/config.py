from typing import List
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    API_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Algae Monitoring System API"
    ALLOWED_ORIGINS: List[str] = ["*"]
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    MODEL_PATH: str = os.path.join(os.getcwd(), "app/ml/models")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings() 