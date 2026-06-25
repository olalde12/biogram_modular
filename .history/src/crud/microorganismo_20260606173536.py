from sqlalchemy.orm import Session
from src.models.microorganismo import Microorganismo
from src.schemas.microorganismo import MicroorganismoCreate

# Metodo GET: obtiene todos los microorganismos
def get_microorganismos(db: Session):
    return db.query(Microorganismo).all()

from src.db.base_class import Base

# Mostrar todas las tablas registradas en el metadata
print(Base.metadata.tables.keys())
