from sqlalchemy.orm import Session
from src.models.microorganismo import Microorganismo
from src.schemas.microorganismo import MicroorganismoCreate

# Metodo GET: obtiene todos los microorganismos
def get_microorganismos(db: Session):
    return db.query(Microorganismo).all()

# Metodo GET: obtiene un microorganismo por id
def get_microorganismo_by_id(db: Session, id_microorganismo: int):
    return db.query(Microorganismo).filter(Microorganismo.id_microorganismo == id_microorganismo).first()

def create_microorganismo(db: Session, micrororga)
