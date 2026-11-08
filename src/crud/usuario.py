from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.usuarios import Usuarios
from src.schemas.usuarios import UsuarioCreate, UsuarioUpdate
from src.seguridad.password import hash_password
from src.seguridad.correo import generar_hmac_correo

# Metodo GET: obtiene un usuario por id
def get_usuario_by_id(db: Session, id_usuario: int):
    return db.query(Usuarios).filter(Usuarios.id_usuario == id_usuario).first()

# Metodo GET: obtiene un usuario por correo
def get_usuario_by_email(db: Session, email: str):
    huella = generar_hmac_correo(email)
    return db.query(Usuarios).filter(Usuarios.correo_hmac == huella).first()

# Metodo POST: crea un usuario
def create_usuario(db: Session, usuario: UsuarioCreate):
    datos = usuario.model_dump()
    datos["correo_hmac"] = generar_hmac_correo(datos["correo"])
    datos["contraseña"] = hash_password(datos["contraseña"])
    db_usuario = Usuarios(**datos, fecha_registro=date.today(), estado=True)
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Metodo PUT: modifica a un usuario
def update_usuario(db: Session, id_usuario: int, usuario: UsuarioUpdate):
    db_usuario = get_usuario_by_id(db, id_usuario)
    if not db_usuario:
        return None
    datos = usuario.model_dump(exclude_unset=True, exclude_none=True)
    if "correo" in datos:
        nuevo_correo = datos["correo"].strip().lower()
        nueva_huella = generar_hmac_correo(nuevo_correo)
        correo_existente = db.query(Usuarios).filter(
            Usuarios.correo_hmac == nueva_huella,
            Usuarios.id_usuario != id_usuario  
        ).first()
        if correo_existente:
            raise HTTPException(status_code=409, detail="Ese correo ya existe")
        datos["correo"] = nuevo_correo
        datos["correo_hmac"] = nueva_huella
    if "contraseña" in datos:
        datos["contraseña"] = hash_password(datos["contraseña"])
    for key, value in datos.items():
        setattr(db_usuario, key, value)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Metodo DELETE: elimina a un usuario
def delete_usuario(db: Session, id_usuario: int):
    db_usuario = get_usuario_by_id(db, id_usuario)
    if not db_usuario:
        return None
    db_usuario.estado = False
    db.commit()
    db.refresh(db_usuario)
    return db_usuario
