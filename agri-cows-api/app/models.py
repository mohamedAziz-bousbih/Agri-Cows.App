from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db
from sqlalchemy import event

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), nullable=False, default="user")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw):
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.password_hash, raw)

class Vache(db.Model):
    __tablename__ = "vaches"

    id = db.Column(db.String(255), primary_key=True)
    date_dernier_village = db.Column(db.String(255))
    date_prochain_village = db.Column(db.String(255))
    date_insimination = db.Column(db.String(255))
    date_taghriz = db.Column(db.String(255))
    historique_medical_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    productions = db.relationship("LaitProduction", backref="vache", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "date_dernier_village": self.date_dernier_village,
            "date_prochain_village": self.date_prochain_village,
            "date_insimination": self.date_insimination,
            "date_taghriz": self.date_taghriz,
            "historique_medical_url": self.historique_medical_path,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class LaitProduction(db.Model):
    __tablename__ = "lait_productions"
    id = db.Column(db.Integer, primary_key=True)
    vache_id = db.Column(db.String(255), db.ForeignKey("vaches.id"), nullable=False, index=True)
    quantite_lait_matin = db.Column(db.Float, default=0.0)
    quantite_lait_soir = db.Column(db.Float, default=0.0)
    somme_quantite = db.Column(db.Float, default=0.0)
    date = db.Column(db.String(255), nullable=False, index=True)
    remarque = db.Column(db.Text)

    def recompute_sum(self):
        self.somme_quantite = (self.quantite_lait_matin or 0.0) + (self.quantite_lait_soir or 0.0)

@event.listens_for(LaitProduction, "before_insert")
def _lp_before_insert(mapper, connection, target):
    target.recompute_sum()

@event.listens_for(LaitProduction, "before_update")
def _lp_before_update(mapper, connection, target):
    target.recompute_sum()
