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
    db_prueba = Pruebas_bioquimicas(
        nombre=prueba.nombre,
        tipo_resultado=prueba.tipo_resultado,
        fundamento=prueba.fundamento,
        tiempo_reaccion=prueba.tiempo_reaccion,
        descripcion=prueba.
    )
    db.add(db_prueba)
    db.commit()
    db.refresh(db_prueba)

    # Crear las opciones asociadas
    for opcion in prueba.opciones:
        db_opcion = OpcionORM(
            nombre_resultado=opcion.nombre_resultado,
            descripcion_resultado=opcion.descripcion_resultado,
            imagen_resultado=opcion.imagen_resultado,
            id_prueba=db_prueba.id_prueba
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
    for key, value in prueba.dict().items():
        setattr(db_prueba, key, value)
    db.commit()
    db.refresh(db_prueba)
    return db_prueba

# Metodo DELETE: elimina una prueba
def delete_prueba(db: Session, id_prueba: int):
    db_prueba = db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.id_prueba==id_prueba).first()
    db.delete(db_prueba)
    db.commit()
    return db_prueba
