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
            id_medio=db_medio_micro.id_medio,
            id_micro=db_medio_micro.id_
        )
        db.add(db_opcion)
    db.commit()
    db.refresh(db_prueba)
    return db_prueba

# Metodo PUT: modifica una prueba
def update_prueba(db: Session, id_prueba: int, prueba: PruebaCreate):
    db_prueba = db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.id_prueba == id_prueba).first()
    if not db_prueba:
        return None
    db_prueba.nombre = prueba.nombre
    db_prueba.tipo_resultado = prueba.tipo_resultado
    db_prueba.fundamento = prueba.fundamento
    db_prueba.tiempo_reaccion = prueba.tiempo_reaccion
    db_prueba.descripcion = prueba.descripcion
    db.query(Opcion_prueba).filter(Opcion_prueba.id_prueba == id_prueba).delete()
    for opcion in prueba.opc_prueba:
        db_opcion = Opcion_prueba(
            nombre_resultado=opcion.nombre_resultado,
            descripcion_resultado=opcion.descripcion_resultado,
            imagen_resultado=opcion.imagen_resultado,
            id_prueba=id_prueba
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
