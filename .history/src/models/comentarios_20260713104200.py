from datetime import date
from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

# Definicion del modelo comentarios
class Comentarios(Base):
    __tablename__="comentarios"
    id_comentario = Column(Integer, primary_key=True, index=True)
    contenido = Column(String, index=True)
    fecha_creacion = Column(Date, server_default=func.current_date())
    id_publicacion = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_usuario = Column(Boolean, default=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id_usuario"))


    cuestionario = relationship('Cuestionario', back_populates='usuario')
