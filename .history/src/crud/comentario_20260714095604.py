from datetime import date
from sqlalchemy.orm import Session
from src.models.comentarios import Comentarios
from src.schemas.comentario import ComentarioCreate, ComentarioUpdate

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
def update_comentario(db: Session, id_comentario: int, comentario: ComentarioUpdate):
    db_comentario = db.query(Comentarios).filter(Comentarios.id_comentario == id_comentario).first()
    if not db_comentario:
        return None
    for key, value in comentario.dict().items():
        setattr(db_comentario, key, value)
    db.commit()
    db.refresh(db_comentario)
    return db_comentario

# Metodo DELETE: elimina un comentario
def delete_comentario(db: Session, id_comentario: int):
    db_comentario = db.query(Comentarios).filter(Comentarios.id_comentario==id_comentario).first()
    db.delete(db_comentario)
    db.commit()
    return db_comentario
