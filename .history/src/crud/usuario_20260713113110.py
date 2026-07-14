from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.usuarios import Usuarios
from src.models.cuestionario import Cuestionario
from src.schemas.usuarios import UsuarioCreate

# Metodo GET: obtiene un usuario por id
def get_usuario_by_id(db: Session, email: str):
    return db.query(Usuarios).filter(Usuarios.correo == email).first()

# Metodo GET: obtiene un usuario por correo
def get_usuario_by_email(db: Session, email: str):
    return db.query(Usuarios).filter(Usuarios.correo == email).first()

# Metodo POST: crea un usuario
def create_usuario(db: Session, usuario: UsuarioCreate):
    db_usuario = Usuarios(
        **usuario.dict(),
        fecha_registro=date.today(),
        estado=True)
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Metodo PUT: modifica a un usuario
def update_usuario(db: Session, id_usuario: int, usuario: UsuarioCreate):
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
    db.query(Cuestionario).filter(Cuestionario.id_usuario == id_usuario).update({"estado": False})
    db.commit()
    db.refresh(db_usuario)
    return db_usuario
