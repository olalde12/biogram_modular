from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.cuestionario import Cuestionario
from src.schemas.cuestionario import CuestionarioCreate

# Metodo GET: obtiene todos los cuestionarios
def get_cuestionarios(db: Session):
    return db.query(Cuestionario).all()

# Metodo GET: obtiene un cuestionario por id
def get_cuestionario_by_id(db: Session, id_cuestionario: int):
    return db.query(Cuestionario).filter(Cuestionario.id_cuestionario == id_cuestionario).first()

# Metodo GET: obtiene un cuestionario por nombre
def get_cuestionario_by_name(db: Session, nombre: str):
    return db.query(Cuestionario).filter(Cuestionario.nombre == nombre).first()

# Metodo POST: crea un cuestionario
def create_cuestionario(db: Session, cuestionario: CuestionarioCreate):
    db_cuestionario = Cuestionario(
        **cuestionario.dict(),
        fecha_=date.today(),
        estado=True,
        )
    db.add(db_cuestionario)
    db.commit()
    db.refresh(db_cuestionario)
    return db_cuestionario

# Metodo PUT: modifica a un cuestionario
def update_cuestionario(db: Session, id_cuestionario: int, cuestionario: C):
    db_usuario = db.query(Usuarios).filter(Usuarios.id_usuario == id_usuario).first()
    if not db_usuario:
        return None
    if usuario.correo:
        correo_existente = db.query(Usuarios).filter(
            Usuarios.correo == usuario.correo,
            Usuarios.id_usuario != id_usuario  
        ).first()
        if correo_existente:
            raise HTTPException(status_code=400, detail="Ese correo ya existe")
    for key, value in usuario.dict().items():
        setattr(db_usuario, key, value)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Metodo DELETE: elimina a un usuario
def delete_usuario(db: Session, id_usuario: int):
    db_usuario = db.query(Usuarios).filter(Usuarios.id_usuario == id_usuario).first()
    if not db_usuario:
        return None
    db_usuario.estado = False
    db.commit()
    db.refresh(db_usuario)
    return db_usuario
