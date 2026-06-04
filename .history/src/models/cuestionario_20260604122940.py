from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Cuestionario(Base):
    id_cuestionario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    fecha = Column(Date, server_default=func.now())
    estado = Column(Boolean, default=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    usuario = relationship("Usuario", back_populates="cuestionario")
    cuestionario = relationship("Cuestionario", back_populates="res_cuestionario")
    prueba = relationship("Pruebas_bioquimicas", back_populates="res_prueba")