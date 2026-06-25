from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import usuario as usuario_crud
from src.schemas import usuarios as usuarios_schema

router = APIRouter()

# Ruta para obtener un microorganismo por id
@router.get('/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def read_microorganismo_by_id(id_microorganismo: int, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return db_microorganismo

# Ruta para obtener un microorganismo por nombre
@router.get('/name/{nombre}', response_model=microorganismo_schema.Microorganismo)
def read_microorganismo_by_name(nombre: str, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_name(db, nombre=nombre)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return db_microorganismo

# Ruta para crear un microorganismo
@router.post('/create', response_model=microorganismo_schema.Microorganismo)
def create_microorganismo(microorganismo: microorganismo_schema.MicroorganismoCreate, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_name(db, nombre=microorganismo.nombre)
    if db_microorganismo:
        raise HTTPException(status_code=400, detail='Ese microorganismo ya existe')
    return microorganismo_crud.create_microorganismo(db=db, microorganismo=microorganismo)

# Ruta para modificar un microorganismo
@router.put('/update/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def update_microorganismo(id_microorganismo: int, microorganismo: microorganismo_schema.MicroorganismoCreate, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return microorganismo_crud.update_microorganismo(db=db, id_microorganismo=id_microorganismo, microorganismo=microorganismo)

# Ruta para eliminar un microorganismo
@router.delete('/delete/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def delete_microorganismo(id_microorganismo: int, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return microorganismo_crud.delete_microorganismo(db=db, id_microorganismo=id_microorganismo)
