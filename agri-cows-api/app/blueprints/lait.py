from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from ..extensions import db
from ..models import LaitProduction, Vache
from ..schemas import LaitProductionSchema

bp = Blueprint("lait", __name__)
lp_schema = LaitProductionSchema()
lps_schema = LaitProductionSchema(many=True)


def json_body():
    return request.get_json(silent=True) or {}


@bp.errorhandler(ValidationError)
def handle_validation_error(err: ValidationError):
    return jsonify({"msg": "Validation error", "errors": err.messages}), 400


# LISTE : GET /api/vaches/<vache_id>/lait
@bp.get("/vaches/<vache_id>/lait")
def list_lait(vache_id):
    Vache.query.get_or_404(str(vache_id))
    items = (
        LaitProduction.query
        .filter_by(vache_id=str(vache_id))
        .order_by(LaitProduction.date.desc(), LaitProduction.id.desc())
        .all()
    )
    return jsonify(lps_schema.dump(items)), 200


# CREATION : POST /api/vaches/<vache_id>/lait
@bp.post("/vaches/<vache_id>/lait")
def create_lait(vache_id):
    Vache.query.get_or_404(str(vache_id))

    payload = json_body()
    payload["vache_id"] = str(vache_id)  # on force en string
    data = lp_schema.load(payload)

    lp = LaitProduction(**data)
    db.session.add(lp)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "DB error", "detail": str(e)}), 500

    return jsonify(lp_schema.dump(lp)), 201


# MISE A JOUR : PUT /api/vaches/<vache_id>/lait/<lid>
@bp.put("/vaches/<vache_id>/lait/<int:lid>")
def update_lait(vache_id, lid):
    Vache.query.get_or_404(str(vache_id))
    lp = LaitProduction.query.get_or_404(lid)

    if str(lp.vache_id) != str(vache_id):
        return jsonify({"msg": "Not found"}), 404

    data = lp_schema.load(json_body(), partial=True)
    for k, v in data.items():
        setattr(lp, k, v)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "DB error", "detail": str(e)}), 500

    return jsonify(lp_schema.dump(lp)), 200


# SUPPRESSION : DELETE /api/vaches/<vache_id>/lait/<lid>
@bp.delete("/vaches/<vache_id>/lait/<int:lid>")
def delete_lait(vache_id, lid):
    Vache.query.get_or_404(str(vache_id))
    lp = LaitProduction.query.get_or_404(lid)

    if str(lp.vache_id) != str(vache_id):
        return jsonify({"msg": "Not found"}), 404

    try:
        db.session.delete(lp)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "DB error", "detail": str(e)}), 500

    return jsonify({"deleted": True}), 200
