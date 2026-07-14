from datetime import date
from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

# Definicion del modelo publicaciones
class Publicaciones(Base):
    __tablename__="publicaciones"
    id_publicacion = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    contenido = Column(String)
    fecha_registro = Column(Date, server_default=func.current_date())
    estado = Column(Boolean, default=True)

    cuestionario = relationship('Cuestionario', back_populates='usuario')
