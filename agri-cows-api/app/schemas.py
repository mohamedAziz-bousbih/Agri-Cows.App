from marshmallow import Schema, fields, validate
from marshmallow import Schema, fields, pre_load
from datetime import datetime
class UserCreateSchema(Schema):
    nom = fields.Str(required=True, validate=validate.Length(min=3))
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))
    role = fields.Str(load_default="user")

class LoginSchema(Schema):
    nom = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

class VacheSchema(Schema):
    id = fields.Str(required=True)
    date_dernier_village = fields.Str(allow_none=True)
    date_prochain_village = fields.Str(allow_none=True)
    date_insimination = fields.Str(allow_none=True)
    date_taghriz = fields.Str(allow_none=True)
    historique_medical_url = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

    
class LaitProductionSchema(Schema):
    id = fields.Int(dump_only=True)
    vache_id = fields.Str(required=True)
    date = fields.Str(required=True) 
    quantite_lait_matin = fields.Float(required=True)
    quantite_lait_soir = fields.Float(required=True)
    remarque = fields.Str(allow_none=True)
