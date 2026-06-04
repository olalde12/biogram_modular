from sqlalchemy import Column, BigInteger, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Resultado_prueba_micro(Base):
    id_resultado = Column(BigInteger, primary_key=True, index=True)
    resultado = Column(String)

    id_cuesti = Column(Integer, ForeignKey("cuestionario.id_cuestionario"))
    id_prueba = Column(Integer, ForeignKey("pruebas_bioquimicas.id_prueba"))

    cuestionario = relationship("Cuestionario", back_populates="res_cuestionario")
    prueba = relationship("Pruebas_bioquimicas", back_populates="res_prueba")