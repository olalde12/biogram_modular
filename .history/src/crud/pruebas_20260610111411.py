from sqlalchemy.orm import Session
from src.models.pruebas_bioquimicas import Pruebas_bioquimicas
from src.schemas.pruebas_bioquimicas import PruebaCreate

# Metodo GET: obtiene todas las pruebas
def get_pruebas(db: Session):
    return db.query(Pruebas_bioquimicas).all()

# Metodo GET: obtiene una prueba por id
def get_prueba_by_id(db: Session, id_prueba: int):
    return db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.id_prueba == id_prueba).first()

# Metodo GET: obtiene una prueba por nombre
def get_prueba_by_name(db: Session, nombre: str):
    return db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.nombre == nombre).first()

# Metodo POST: crea una prueba
def create_prueba(db: Session, prueba: PruebaCreate):
    db_prueba = Pruebas_bioquimicas(**prueba.dict())
    db.add(db_prueba)
    db.commit()
    db.refresh(db_prueba)
    return db_prueba

# Metodo PUT: modifica una prueba
def update_prueba(db: Session, id_prueba: int, prueba: MicroorganismoCreate):
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
