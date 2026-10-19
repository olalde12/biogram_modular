from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from src.db.base_class import Base

class Likes(Base):
    __tablename__ = "likes"
    id_likes = Column(Integer, primary_key=True, index=True)
    id_publicacion = Column(Integer, ForeignKey("publicaciones.id_publicacion"))
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    __table_args__ = (
        UniqueConstraint(
            "id_publicacion",
            "id_usuario",
            name="uq_me_gusta_usuario_publicacion"
        ),
    )

    publicacion = relationship("Publicaciones", back_populates="likes")