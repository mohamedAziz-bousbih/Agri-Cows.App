from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from ..extensions import db
from ..models import User
from ..schemas import UserCreateSchema, LoginSchema
from datetime import timedelta

bp = Blueprint("auth", __name__)
user_create_schema = UserCreateSchema()
login_schema = LoginSchema()

@bp.post("/login")
def login():
    data = login_schema.load(request.json or {})
    user = User.query.filter_by(nom=data["nom"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"msg": "Identifiants invalides"}), 401
    additional = {"role": user.role, "nom": user.nom}
    token = create_access_token(identity=user.id, additional_claims=additional, expires_delta=timedelta(hours=12))
    return jsonify(access_token=token)

@bp.post("/users")
@jwt_required()
def create_user():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Accès refusé"}), 403
    data = user_create_schema.load(request.json or {})
    if User.query.filter_by(nom=data["nom"]).first():
        return jsonify({"msg": "Nom déjà existant"}), 400
    user = User(nom=data["nom"], role=data["role"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "nom": user.nom, "role": user.role}), 201
