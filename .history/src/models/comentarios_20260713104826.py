from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

# Definicion del modelo comentarios
class Comentarios(Base):
    __tablename__="comentarios"
    id_comentario = Column(Integer, primary_key=True, index=True)
    contenido = Column(String)
    fecha_creacion = Column(Date, server_default=func.current_date())
    id_publicacion = Column(Integer, ForeignKey("publicaciones.id_publicacion"))
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    publicacion = relationship('Publicaciones', back_populates='comentarios')
    usuario_comentario = relationship('Usuarios', back_populates='comentarios_usuario')
