from sqlalchemy.orm import Session
from src.models.medios_cultivo import Medio_cultivo
from src.models.medio_microorganismo import Medio_microorganismo
from src.schemas.medio_cultivo import MedioCreate

# Metodo GET: obtiene todos los medios
def get_medios(db: Session):
    return db.query(Medio_cultivo).all()

# Metodo GET: obtiene un medio por id
def get_medio_by_id(db: Session, id_medio: int):
    return db.query(Medio_cultivo).filter(Medio_cultivo.id_medio == id_medio).first()

# Metodo GET: obtiene un medio por nombre
def get_medio_by_name(db: Session, nombre: str):
    return db.query(Medio_cultivo).filter(Medio_cultivo.nombre == nombre).first()

# Metodo POST: crea un medio
def create_medio(db: Session, medio: MedioCreate):
    db_medio = Medio_cultivo(
        nombre=medio.nombre,
        procedimiento=medio.procedimiento,
        imagen=medio.imagen,
        tipo_muestra=medio.tipo_muestra,
        descripcion=medio.descripcion
    )
    db.add(db_medio)
    db.commit()
    db.refresh(db_medio)
    for medio_micro in medio.resultado:
        db_medio_micro = Medio_microorganismo(
            id_micro=db_medio_micro.id_micro
        )
        db.add(db_medio_micro)
    db.commit()
    db.refresh(db_medio)
    return db_medio

# Metodo PUT: modifica una medio
def update_medio(db: Session, id_medio: int, medio: MedioCreate):
    db_medio = db.query(Medio_cultivo).filter((Medio_cultivo).id_medio == id_medio).first()
    if not db_medio:
        return None
    db_medio.nombre = medio.nombre
    db_medio.procedimiento = medio.procedimiento
    db_medio.imagen = medio.imagen
    db_medio.tipo_muestra = medio.tipo_muestra
    db_medio.descripcion = medio.descripcion
    db.query(Medio_microorganismo).filter(Medio_microorganismo.id_medio == id_medio).delete()
    for medio_micro in medio.resultado:
        db_medio_micro = Medio_microorganismo(
            id_microor
        )
        db.add(db_opcion)
    db.commit()
    db.refresh(db_prueba)
    _ = db_prueba.opc_prueba 
    return db_prueba

# Metodo DELETE: elimina una prueba
def delete_prueba(db: Session, id_prueba: int):
    db_prueba = db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.id_prueba==id_prueba).first()
    db.delete(db_prueba)
    db.query(Opcion_prueba).filter(Opcion_prueba.id_prueba == id_prueba).delete()
    db.commit()
    return db_prueba
