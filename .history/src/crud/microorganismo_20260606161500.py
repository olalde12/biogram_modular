from sqlalchemy.orm import Session
from src.models.microorganismo import Microorganismo
from src.schemas.microorganismo import MicroorganismoCreate

# Endpoint para obtener todos los microorganismos
def get_microorganismo(db: Session):
    return db.query(Microorganismo).all()

def 