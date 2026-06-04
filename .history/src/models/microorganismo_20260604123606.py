from sqlalchemy import Column, Integer, String
from src.db.base_class import Base

class Microorganismo(Base):
    id_microorganismo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    gram = Column(String)
    forma = Column(String)
    descripcion = Column(String)
    imagen = Column(String)
    tipo = Column(String)

    micro = relationship("Microorganismo", back_populates="res_prueba_micro")