from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Usuarios(Base):
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    apellido = Column(String)
    correo = Column(String, unique=True, index=True)
    contraseña = Column(String)
    fecha_registro = Column(Date, server_default=func.now())
    estado = Column(Boolean, default=True)

"""
    cuestionario = relationship('Cuestionario', back_populates='usuario')
"""