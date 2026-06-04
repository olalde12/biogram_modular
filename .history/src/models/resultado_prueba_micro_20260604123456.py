from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Resultado_prueba_micro(Base):
    id_resultado = Column(Integer, primary_key=True, index=True)
    resultado = Column(String)
    id_micro = Column(Integer, ForeignKey("microorganismo.id_microorganismo"))
    id_prueba = Column(Integer, ForeignKey("pruebas_bioquimicas.id_prueba"))

    micro = relationship("Cuestionario", back_populates="res_cuestionario")
    prueba = relationship("Pruebas_bioquimicas", back_populates="res_prueba")