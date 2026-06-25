from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Resultado_cuestionario
from src.crud import cuestionarios as cuestionario_crud
from src.crud import resultado_cuest as resultado_crud
from src.schemas import resultado_cuestionario as resultado_schema

router = APIRouter()

# Ruta para obtener todos los resultados
@router.get('/', response_model=List[resultado_schema.ResultadoCuest])
def read_resultado_cues(id_cuestionario: int, db: Session = Depends(get_db)):
    db_cuestionario = cuestionario_crud.get_cuestionario_by_id(db, id_cuestionario=id_cuestionario)
    if not db_cuestionario:
        raise HTTPException(status_code=404, detail='Ese cuestionario no exite')
    db_resultados = (db.query(Resultado_cuestionario).filter(Resultado_cuestionario.id_resultado_cues == id_cuestionario).all())
    if not db_resultados:
        raise HTTPException(status_code=404, detail='No hay resultados')
    return db_resultados

