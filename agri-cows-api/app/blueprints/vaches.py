from flask import Blueprint, request, jsonify
from datetime import datetime
from ..extensions import db
from ..models import Vache
from ..utils.files import save_image

bp = Blueprint("vaches", __name__)


# ----------- LIST -----------
@bp.get("/vaches")
def list_vaches():
    q = request.args.get("q")
    query = Vache.query
    if q:
        query = query.filter(Vache.id == q)  # id est String maintenant

    items = query.order_by(Vache.id.asc()).all()
    out = []
    for v in items:
        data = v.to_dict()
        if v.historique_medical_path:
            data["historique_medical_url"] = v.historique_medical_path
        out.append(data)
    return jsonify(out)


# ----------- GET ONE -----------
@bp.get("/vaches/<string:vid>")
def get_vache(vid):
    v = Vache.query.get_or_404(vid)
    data = v.to_dict()
    if v.historique_medical_path:
        data["historique_medical_url"] = v.historique_medical_path
    return jsonify(data)


# ----------- CREATE -----------
@bp.post("/vaches")
def create_vache():
    form = request.form.to_dict()
    print("RAW FORM:", form)

    vache = Vache(**form)

    if "historique_medical" in request.files:
        try:
            url = save_image(request.files["historique_medical"])
            vache.historique_medical_path = url
        except ValueError as e:
            return jsonify({"msg": str(e)}), 400

    db.session.add(vache)
    db.session.commit()

    return jsonify(vache.to_dict()), 201


# ----------- UPDATE -----------
@bp.put("/vaches/<string:vid>")
def update_vache(vid):
    v = Vache.query.get_or_404(vid)

    if request.content_type and "multipart/form-data" in request.content_type:
        form = request.form.to_dict()

        # maj des champs string
        for k in ["id", "date_dernier_village", "date_prochain_village", "date_insimination", "date_taghriz"]:
            if k in form:
                setattr(v, k, form[k] or None)

        if "historique_medical" in request.files:
            try:
                url = save_image(request.files["historique_medical"])
                v.historique_medical_path = url
            except ValueError as e:
                return jsonify({"msg": str(e)}), 400

    else:
        body = request.json or {}
        for k in ["id", "date_dernier_village", "date_prochain_village", "date_insimination", "date_taghriz"]:
            if k in body:
                setattr(v, k, body[k] or None)

    db.session.commit()
    return jsonify(v.to_dict())


# ----------- DELETE -----------
@bp.delete("/vaches/<string:vid>")
def delete_vache(vid):
    v = Vache.query.get_or_404(vid)
    db.session.delete(v)
    db.session.commit()
    return jsonify({"deleted": True})
