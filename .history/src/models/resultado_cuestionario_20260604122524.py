from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Resultado_cuestionario(Base):
    id_resultado_cues = Column(Integer, primary_key=True, index=True)
    resultado = Column(String)
    id_cuesti = Column(Integer, ForeignKey("cuestionario.id_cuestionario"))
    id_prueba = Column(Integer, ForeignKey("pr"))

    cuestionario = relationship("Cuestionario", back_populates="res_cuestionario")