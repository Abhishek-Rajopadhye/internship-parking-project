# app/core/config.py
import os
from pydantic import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Parking"
    API_V1_STR: str = "/api/v1"

    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost/smart_parking"

    # Security Configuration
    SECRET_KEY: str = "your_secret_key_here"  # Change this in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # Token expiry in minutes

    # CORS Settings
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]  # Allowed frontend origins

    # Payment Gateway (example)
    PAYMENT_GATEWAY_API_KEY: str = "your_payment_gateway_key"

    class Config:
        env_file = ".env"  # Load environment variables from a .env file

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
