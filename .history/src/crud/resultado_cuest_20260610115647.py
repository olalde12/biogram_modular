from sqlalchemy.orm import Session
from src.models.resultado_cuestionario import Resultado_cuestionario
from src.schemas.resultado_cuestionario import ResultadoCuestCreate

# Metodo GET: obtiene resultados por id
def get_rescues_by_id(db: Session, id_resultado_cues: int):
    return db.query(Resultado_cuestionario).filter(Resultado_cuestionario.id_resultado_cues == id_resultado_cues).first()

# Metodo POST: crea resultados
def create_rescues(db: Session, rescues: ResultadoCuestCreate):
    db_rescues = Resultado_cuestionario(**resultado.dict())
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
