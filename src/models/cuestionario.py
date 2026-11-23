from sqlalchemy import Column, Integer, Float, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

# Definicion del modelo cuestionario
class Cuestionario(Base):
    __tablename__="cuestionarios"
    id_cuestionario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    porcentaje_coincidencia = Column(Float, nullable=True)
    fecha = Column(Date, server_default=func.current_date())
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    usuario = relationship("Usuarios", back_populates="cuestionario")
    res_cuestionario = relationship("Resultado_cuestionario", back_populates="cuestionario", cascade="all, delete-orphan", passive_deletes=True)
