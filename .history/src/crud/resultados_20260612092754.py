from sqlalchemy.orm import Session
from src.models.resultado_prueba_micro import Resultado_prueba_micro
from src.schemas.resultado import ResultadoCuestCreate

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
def update_rescues(db: Session, id_resultado_cues: int, resultado: ResultadoCuestCreate):
    db_resultado = db.query(Resultado_cuestionario).filter(Resultado_cuestionario.id_resultado_cues == id_resultado_cues).first()
    if not db_resultado:
        return None
    for key, value in resultado.dict().items():
        setattr(db_resultado, key, value)
    db.commit()
    db.refresh(db_resultado)
    return db_resultado
