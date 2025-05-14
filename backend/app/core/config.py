from typing import List
from pydantic_settings import BaseSettings
import os


# Define CORS origins directly (hardcoded for development)
CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]


class Settings(BaseSettings):
    API_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Algae Monitoring System API"
    # Define the field properly with a default value
    ALLOWED_ORIGINS: List[str] = CORS_ORIGINS
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    MODEL_PATH: str = os.path.join(os.getcwd(), "app/ml/models")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings() 