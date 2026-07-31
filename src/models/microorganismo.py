from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from src.db.base_class import Base

# Definicion del modelo microorganismo
class Microorganismo(Base):
    __tablename__="microorganismos"
    id_microorganismo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    gram = Column(String)
    forma = Column(String)
    descripcion = Column(String)
    imagen = Column(String)
    tipo = Column(String)

    res_prueba_micro = relationship("Resultado_prueba_micro", back_populates="micro")
    resultado = relationship("Medio_microorganismo", back_populates="micro")
