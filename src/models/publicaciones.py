from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

# Definicion del modelo publicaciones
class Publicaciones(Base):
    __tablename__="publicaciones"
    id_publicacion = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    contenido = Column(String)
    fecha_creacion = Column(Date, server_default=func.current_date())
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    usuario_publicacion = relationship('Usuarios', back_populates='publicaciones')
    comentarios = relationship('Comentarios', back_populates='publicacion')
