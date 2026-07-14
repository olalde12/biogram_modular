from datetime import date
from sqlalchemy.orm import Session
from src.models.comentarios import Comentarios
from src.schemas.comentario import ComentarioCreate

# Metodo GET: obtiene un comentario por id
def get_comentario_by_id(db: Session, id_comentario: int):
    return db.query(Comentarios).filter(Comentarios.id_comentario == id_comentario).first()

# Metodo POST: crea un comentario
def create_comentario(db: Session, comentario: ComentarioCreate):
    db_comentario = Comentarios(
        **comentario.dict(),
        fecha_creacion=date.today(),
        )
    db.add(db_comentario)
    db.commit()
    db.refresh(db_comentario)
    return db_comentario

# Metodo PUT: modifica a un comentario
def update_comentario(db: Session, id_comen: int, publicacion: PublicacionCreate):
    db_publicacion = db.query(Publicaciones).filter(Publicaciones.id_publicacion == id_publicacion).first()
    if not db_publicacion:
        return None
    for key, value in publicacion.dict().items():
        setattr(db_publicacion, key, value)
    db.commit()
    db.refresh(db_publicacion)
    return db_publicacion

# Metodo DELETE: elimina una publicacion
def delete_publicacion(db: Session, id_publicacion: int):
    db_publicacion = db.query(Publicaciones).filter(Publicaciones.id_publicacion==id_publicacion).first()
    db.query(Comentarios).filter(Comentarios.id_publicacion == id_publicacion).delete()
    db.delete(db_publicacion)
    db.commit()
    return db_publicacion
