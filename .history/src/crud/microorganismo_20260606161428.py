from sqlalchemy.orm import Session
from src.models.microorganismo import Microorganismo
from src.schemas.microorganismo import MicroorganismoCreate

def get_microorganismo(db: Session):
    return db.query(Microorganismo).all()