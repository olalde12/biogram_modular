from sqlalchemy import Column, Integer, String
from src.db.base_class import Base

# Definicion del modelo antibiograma
class Antibiograma(Base):
    __tablename__=""
    id_antibiograma = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
