from sqlalchemy import Column, Integer, String, Boolean, Date, Index
from src.seguridad.tipos import CorreoCifrado
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

# Definicion del modelo usuarios
class Usuarios(Base):
    __tablename__="usuarios"
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    apellido = Column(String)
    correo = Column(CorreoCifrado(), nullable=False)
    correo_hmac = Column(String(64), nullable=False)
    contraseña = Column(String)
    avatar = Column(String)
    fecha_registro = Column(Date, server_default=func.current_date())
    estado = Column(Boolean, default=True)

    __table_args__ = (
        Index("ux_usuarios_correo_hmac", "correo_hmac", unique=True),
    )

    cuestionario = relationship('Cuestionario', back_populates='usuario')
    publicaciones = relationship('Publicaciones', back_populates='usuario_publicacion')
    comentarios_usuario = relationship('Comentarios', back_populates='usuario_comentario')
