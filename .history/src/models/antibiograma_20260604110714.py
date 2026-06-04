from sqlalchemy import Column, BigInteger, String
from src.db.base_class import Base

class Antibiograma(Base):
    id_antibiograma = Column(BigInteger, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
