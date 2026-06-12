from sqlalchemy.orm import Session
from src.models.usuarios import Usuarios
from src.schemas.usuarios import UsuarioCreate

# Metodo GET: obtiene un usuario por id
def get_usuario_by_id(db: Session, id_usuario: int):
    return db.query(Usuarios).filter(Usuarios.id_usuario == id_usuario).first()

# Metodo GET: obtiene un usuario por nombre
def get_usuario_by_name(db: Session, nombre: str):
    return db.query(Usuario).filter(Microorganismo.nombre == nombre).first()

# Metodo POST: crea un microorganismo
def create_microorganismo(db: Session, microorganismo: MicroorganismoCreate):
    db_microorganismo = Microorganismo(**microorganismo.dict())
    db.add(db_microorganismo)
    db.commit()
    db.refresh(db_microorganismo)
    return db_microorganismo

# Metodo PUT: modifica un microorganismo
def update_microorganismo(db: Session, id_microorganismo: int, microorganismo: MicroorganismoCreate):
    db_microorganismo = db.query(Microorganismo).filter(Microorganismo.id_microorganismo == id_microorganismo).first()
    if not db_microorganismo:
        return None
    for key, value in microorganismo.dict().items():
        setattr(db_microorganismo, key, value)
    db.commit()
    db.refresh(db_microorganismo)
    return db_microorganismo

# Metodo DELETE: elimina un microorganismo
def delete_microorganismo(db: Session, id_microorganismo: int):
    db_microorganismo = db.query(Microorganismo).filter(Microorganismo.id_microorganismo==id_microorganismo).first()
    db.delete(db_microorganismo)
    db.commit()
    return db_microorganismo
