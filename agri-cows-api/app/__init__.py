import os
from flask import Flask
from dotenv import load_dotenv
from .config import Config
from .extensions import db, migrate, jwt
from .blueprints.auth import bp as auth_bp
from .blueprints.vaches import bp as vaches_bp
from .blueprints.lait import bp as lait_bp
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

def create_app():
    load_dotenv()
    app = Flask(__name__, static_folder="static")
    app.config.from_object(Config())

    # CORS
    origins = os.getenv("CORS_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": origins}})

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(vaches_bp, url_prefix="/api")
    app.register_blueprint(lait_bp, url_prefix="/api")

    # Ensure upload dir exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # CLI seed
    from .models import User
    @app.cli.command("create-admin")
    def create_admin():
        """Create default admin user (env: ADMIN_NOM, ADMIN_PASSWORD)."""
        nom = os.getenv("ADMIN_NOM", "admin")
        pwd = os.getenv("ADMIN_PASSWORD", "admin123")
        if User.query.filter_by(nom=nom).first():
            print("Admin already exists")
            return
        u = User(nom=nom, role="admin")
        u.set_password(pwd)
        db.session.add(u)
        db.session.commit()
        print(f"Admin created: {nom} / {pwd}")

    return app
