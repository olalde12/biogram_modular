from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base_class import Base

# Definicion del modelo resultado_prueba_micro
class Resultado_prueba_micro(Base):
    __tablename__="resultados_prueba_micro"
    id_resultado = Column(Integer, primary_key=True, index=True)
    id_micro = Column(Integer, ForeignKey("microorganismos.id_microorganismo"))
    id_prueba = Column(Integer, ForeignKey("pruebas_bioquimicas.id_prueba"))
    id_opcion = Column(Integer, ForeignKey("opciones_prueba.id_opcion_prueba"))

    micro = relationship("Microorganismo", back_populates="res_prueba_micro")
    prueba = relationship("Pruebas_bioquimicas", back_populates="res_prueba_micro")
    opcion = relationship("Opcion_prueba", back_populates="res_opcion_pm")