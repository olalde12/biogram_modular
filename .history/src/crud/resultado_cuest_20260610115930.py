from sqlalchemy.orm import Session
from src.models.resultado_cuestionario import Resultado_cuestionario
from src.schemas.resultado_cuestionario import ResultadoCuestCreate

# Metodo GET: obtiene resultados por id
def get_rescues_by_id(db: Session, id_resultado_cues: int):
    return db.query(Resultado_cuestionario).filter(Resultado_cuestionario.id_resultado_cues == id_resultado_cues).first()

# Metodo POST: crea resultados
def create_rescues(db: Session, resultado: ResultadoCuestCreate):
    db_resultado = Resultado_cuestionario(**resultado.dict())
    db.add(db_resultado)
    db.commit()
    db.refresh(db_resultado)
    return db_resultado

# Metodo PUT: modifica resultados
def update_rescues(db: Session, id_resultado_cues: int, resultado: ResuCreate):
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
