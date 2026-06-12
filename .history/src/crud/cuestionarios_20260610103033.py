from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.cuestionario import Cuestionario
from src.schemas.cuestionario import CuestionarioCreate


# Metodo GET: obtiene un cuestionario por id
def get_cuestionario_by_id(db: Session, id_cuestionario: int):
    return db.query(Cuestionario).filter(Cuestionario.id_cuestionario == id_cuestionario).first()

# Metodo GET: obtiene un cuestionario por nombre
def get_cuestionario_by_name(db: Session, nombre: str, id_usuario: int):
    return db.query(Cuestionario).filter(Cuestionario.nombre == nombre, Cuestionario.id_usuario == id_usuario).first()

# Metodo POST: crea un cuestionario
def create_cuestionario(db: Session, cuestionario: CuestionarioCreate):
    db_cuestionario = Cuestionario(
        **cuestionario.dict(),
        fecha=date.today(),
        estado=True,
        )
    db.add(db_cuestionario)
    db.commit()
    db.refresh(db_cuestionario)
    return db_cuestionario

# Metodo PUT: modifica a un cuestionario
def update_cuestionario(db: Session, id_cuestionario: int, cuestionario: CuestionarioCreate):
    db_cuestionario = db.query(Cuestionario).filter(Cuestionario.id_cuestionario == id_cuestionario).first()
    if not db_cuestionario:
        return None
    for key, value in cuestionario.dict().items():
        setattr(db_cuestionario, key, value)
    db.commit()
    db.refresh(db_cuestionario)
    return db_cuestionario

# Metodo DELETE: elimina a un cuestionario
def delete_cuestionario(db: Session, id_cuestionario: int):
    db_cuestionario = db.query(Cuestionario).filter(Cuestionario.id_cuestionario == id_cuestionario).first()
    if not db_cuestionario:
        return None
    db_cuestionario.estado = False
    db.commit()
    db.refresh(db_cuestionario)
    return db_cuestionario
