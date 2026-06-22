from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import microorganismo as microorganismo_crud
from src.schemas import microorganismo as microorganismo_schema

router = APIRouter()

# Ruta para obtener todos los microorganismos
@router.get('/', response_model=List[microorganismo_schema.Microorganismo])
def read_microorganismos(db: Session = Depends(get_db)):
    return microorganismo_crud.get_microorganismos(db)

@router.get('/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def read_microorganismo_by_id(id_microorganismo: int, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if id_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return db_microorganismo
