from sqlalchemy.orm import Session
from src.models.microorganismo import Microorganismo
from src.schemas.microorganismo import MicroorganismoCreate

# Metodo GET: obtiene todos los microorganismos
def get_microorganismos(db: Session):
    return db.query(Microorganismo).all()

def gt
