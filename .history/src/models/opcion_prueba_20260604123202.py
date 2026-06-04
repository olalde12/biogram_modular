from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Opcion_prueba(Base):
    id_opcion_prueba = Column(Integer, primary_key=True, index=True)
    nombre_resultado = Column(String)
    descripcion_resultado = Column(String)
    imagen_resultado = Column(String)
    id_prueba = Column(Integer, ForeignKey("pruebas_bioquimicas.id_prueba"))

    cuestionario = relationship("Cuestionario", back_populates="res_cuestionario")
    prueba = relationship("Pruebas_bioquimicas", back_populates="res_prueba")