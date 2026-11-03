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
    datos = publicacion.model_dump()
    db_publicacion = Publicaciones(
        **datos,
        fecha_creacion=date.today(),
        )
    db.add(db_publicacion)
    db.commit()
    db.refresh(db_publicacion)
    return db_publicacion

# Metodo PUT: modifica a una publicacion
def update_publicacion(db: Session, id_publicacion: int, publicacion: PublicacionUpdate, db_publicacion: Publicaciones = None):
    if db_publicacion is None:
        db_publicacion = get_publicacion_by_id(
            db, id_publicacion=id_publicacion
        )
    if not db_publicacion:
        return None
    datos = publicacion.model_dump(exclude_unset=True)
    for key, value in datos.items():
        setattr(db_publicacion, key, value)
    db.commit()
    db.refresh(db_publicacion)
    return db_publicacion

# Metodo DELETE: elimina una publicacion
def delete_publicacion(db: Session, id_publicacion: int):
    db_publicacion = db.query(Publicaciones).filter(Publicaciones.id_publicacion==id_publicacion).first()
    if not db_publicacion:
        return None
    try:
        # Eliminar los comentarios asociados
        db.query(Comentarios).filter(
            Comentarios.id_publicacion == id_publicacion
        ).delete(synchronize_session=False)

        db.delete(db_publicacion)
        db.commit()

        return db_publicacion

    except Exception:
        db.rollback()
        raise
