from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Cuestionario(Base):
    id_cuestionario = Column(BigInteger, primary_key=True, index=True)
    nombre = Column(String, index=True)
    fecha = Column(Date, server_default=func.now())
    estado = Column(Boolean, default=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))