from sqlalchemy.orm import Session
from src.models.resultado_cuestionario import Resultado_cuestionario
from src.schemas.resultado_cuestionario import ResultadoCuestCreate

# Metodo GET: obtiene resultados por id
def get_rescues_by_id(db: Session, id_prueba: int):
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
