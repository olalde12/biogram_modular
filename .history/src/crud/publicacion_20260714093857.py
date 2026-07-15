from datetime import date
from sqlalchemy.orm import Session
from src.models.publicaciones import Publicaciones
from src.models.comentarios import Comentarios
from src.schemas.publicacion import PublicacionCreate, PublicacionUpdate

# Metodo GET: obtiene una publicacion por id
def get_publicacion_by_id(db: Session, id_publicacion: int):
    return db.query(Publicaciones).filter(Publicaciones.id_publicacion == id_publicacion).first()

# Metodo POST: crea una publicacion
def create_publicacion(db: Session, publicacion: PublicacionCreate):
    db_publicacion = Publicaciones(
        **publicacion.dict(),
        fecha_creacion=date.today(),
        )
    db.add(db_publicacion)
    db.commit()
    db.refresh(db_publicacion)
    return db_publicacion

# Metodo PUT: modifica a una publicacion
def update_publicacion(db: Session, id_publicacion: int, publicacion: PublicacionUpdate):
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
