"""
Centralized configuration management for the social media application
"""
import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""
    
    # Database Configuration
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "social_media_app")
    
    # Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback-secret-key-for-development-only")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Server Configuration
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8001"))
    
    # File Upload Configuration
    UPLOAD_BASE_DIR: Path = Path(os.getenv("UPLOAD_BASE_DIR", "/app/backend/uploads"))
    UPLOAD_MAX_SIZE: int = int(os.getenv("UPLOAD_MAX_SIZE", "10485760"))  # 10MB
    AVATAR_MAX_SIZE: int = int(os.getenv("AVATAR_MAX_SIZE", "5242880"))   # 5MB
    VIDEO_MAX_SIZE: int = int(os.getenv("VIDEO_MAX_SIZE", "52428800"))    # 50MB
    IMAGE_MAX_SIZE: int = int(os.getenv("IMAGE_MAX_SIZE", "10485760"))    # 10MB
    
    UPLOAD_ALLOWED_EXTENSIONS: List[str] = os.getenv(
        "UPLOAD_ALLOWED_EXTENSIONS", 
        "jpg,jpeg,png,gif,mp4,mov,avi"
    ).split(",")
    
    # Upload subdirectories
    UPLOAD_SUBDIRS: List[str] = ["avatars", "poll_options", "poll_backgrounds", "general"]
    
    # Frontend Configuration
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:3000"
    ).split(",")
    
    # Session Configuration
    REFRESH_INTERVAL_MINUTES: int = int(os.getenv("REFRESH_INTERVAL_MINUTES", "60"))
    BEHAVIOR_TRACKING_INTERVAL_SECONDS: int = int(os.getenv("BEHAVIOR_TRACKING_INTERVAL_SECONDS", "30"))
    UI_TIMEOUT_SECONDS: int = int(os.getenv("UI_TIMEOUT_SECONDS", "5"))
    
    # Social Media Defaults
    DEFAULT_AVATAR_URL: str = os.getenv(
        "DEFAULT_AVATAR_URL", 
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    )
    PLACEHOLDER_VIDEO_URL: str = os.getenv(
        "PLACEHOLDER_VIDEO_URL",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    )
    
    # HTTP Status Codes
    class StatusCodes:
        SUCCESS = 200
        CREATED = 201
        BAD_REQUEST = 400
        UNAUTHORIZED = 401
        FORBIDDEN = 403
        NOT_FOUND = 404
        CONFLICT = 409
        UNPROCESSABLE_ENTITY = 422
        INTERNAL_SERVER_ERROR = 500
    
    # API Configuration
    API_PREFIX = "/api"
    API_VERSION = "v1"
    
    # Pagination defaults
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100
    
    # Social features defaults
    MAX_COMMENT_LENGTH = 500
    MAX_POLL_OPTIONS = 4
    MAX_POLL_TITLE_LENGTH = 200
    MIN_POLL_TITLE_LENGTH = 10
    
    # Media configuration
    SUPPORTED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "gif", "webp"]
    SUPPORTED_VIDEO_FORMATS = ["mp4", "mov", "avi", "webm"]
    
    # Validation rules
    MIN_USERNAME_LENGTH = 3
    MAX_USERNAME_LENGTH = 30
    MIN_PASSWORD_LENGTH = 8
    MAX_BIO_LENGTH = 160
    
    @classmethod
    def create_upload_directories(cls):
        """Create upload directories if they don't exist"""
        cls.UPLOAD_BASE_DIR.mkdir(exist_ok=True)
        for subdir in cls.UPLOAD_SUBDIRS:
            (cls.UPLOAD_BASE_DIR / subdir).mkdir(exist_ok=True)

# Global config instance
config = Config()