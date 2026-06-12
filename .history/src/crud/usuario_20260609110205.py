from sqlalchemy.orm import Session
from src.models.usuarios import Usuarios
from src.schemas.usuarios import UsuarioCreate

# Metodo GET: obtiene un usuario por id
def get_usuario_by_id(db: Session, id_usuario: int):
    return db.query(Usuarios).filter(Usuarios.id_usuario == id_usuario).first()

# Metodo GET: obtiene un usuario por nombre
def get_usuario_by_name(db: Session, nombre: str):
    return db.query(Usuarios).filter(Usuarios.nombre == nombre).first()

# Metodo POST: crea un usuario
def create_usuario(db: Session, usuario: UsuarioCreate):
    db_usuario = Usuarios(**usuario.dict())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Metodo PUT: modifica a un usuario
def update_usuario(db: Session, id_usuario: int, usuario: UsuarioCreate):
    db_usuario = db.query(Usuarios).filter(Usuarios.id_usuario == id_usuario).first()
    if not db_usuario:
        return None
    for key, value in usuario.dict().items():
        setattr(db_usuario, key, value)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Metodo DELETE: elimina a un usuario
def delete_usuario(db: Session, id_usuario: int):
    db_usuario = db.query(Usuarios).filter(Usuarios.id_microorganismo==id_microorganismo).first()
    db.delete(db_microorganismo)
    db.commit()
    return db_microorganismo
