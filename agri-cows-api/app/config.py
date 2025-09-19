import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///agri.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "app/static/medical_history")
    MAX_CONTENT_LENGTH = int(eval(os.getenv("MAX_CONTENT_LENGTH", "10*1024*1024")))
