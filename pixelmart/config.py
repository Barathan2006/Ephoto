import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Base configuration settings."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-dev-secret-key-pixelmart-2026')
    
    # Database configuration with graceful fallback to SQLite for local development
    MYSQL_URI = os.getenv('DATABASE_URL')
    if MYSQL_URI and 'mysql' in MYSQL_URI:
        SQLALCHEMY_DATABASE_URI = MYSQL_URI
    else:
        # Fallback to local SQLite file when MySQL server is not locally running
        SQLALCHEMY_DATABASE_URI = os.getenv(
            'SQLITE_DATABASE_URL',
            f"sqlite:///{os.path.join(BASE_DIR, 'pixelmart.db')}"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }

    # Uploads path
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    ORIGINALS_FOLDER = os.path.join(UPLOAD_FOLDER, 'originals')
    PREVIEWS_FOLDER = os.path.join(UPLOAD_FOLDER, 'previews')
    
    # 32MB max upload limit
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 32 * 1024 * 1024))
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'tiff'}

    # Security headers and cookies
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    WTF_CSRF_ENABLED = True
