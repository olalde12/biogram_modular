from sqlalchemy.orm import Session
from src.models.microorganismo import mi
from src.schemas.microorganismo import MicroorganismoCreate

# Metodo GET: obtiene todos los microorganismos
def get_microorganismo(db: Session):
    return db.query(Microorganismo).all()
