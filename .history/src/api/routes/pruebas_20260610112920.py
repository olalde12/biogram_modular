from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import pruebas as pruebas_crud
from src.schemas import pruebas_bioquimicas as pruebas_schema

router = APIRouter()

# Ruta para obtener todas las pruebas
@router.get('/', response_model=List[pruebas_schema.Prueba])
def read_pruebas(db: Session = Depends(get_db)):
    return pruebas_crud.get_pruebas(db)

# Ruta para obtener una prueba por id
@router.get('/{id_prueba}', response_model=pruebas_schema.Prueba)
def read_prueba_by_id(id_prueba: int, db: Session = Depends(get_db)):
    db_prueba = pruebas_crud.get_prueba_by_id(db, id_prueba=id_prueba)
    if db_prueba is None:
        raise HTTPException(status_code=404, detail='Prueba no encontrada')
    return db_prueba

# Ruta para obtener una prueba por nombre
@router.get('/name/{nombre}', response_model=pruebas_schema.Prueba)
def read_prueba_by_name(nombre: str, db: Session = Depends(get_db)):
    db_prueba = pruebas_crud.get_prueba_by_name(db, nombre=nombre)
    if db_prueba is None:
        raise HTTPException(status_code=404, detail='Prueba no encontrada')
    return db_prueba

# Ruta para crear una prueba
@router.post('/create', response_model=pruebas_schema.Prueba)
def create_prueba(prueba: pruebas_schema.PruebaCreate, db: Session = Depends(get_db)):
    db_prueba = pruebas_crud.get_prueba_by_name(db, nombre=prueba.nombre)
    if db_prueba:
        raise HTTPException(status_code=400, detail='Esa prueba ya existe')
    return pruebas_crud.create_prueba(db=db, prueba=prueba)

# Ruta para modificar una prueba
@router.put('/update/{id_prueba}', response_model=pruebas_schema.Prueba)
def update_prueba(id_prueba: int, prueba: pruebas_schema.PruebaCreate, db: Session = Depends(get_db)):
    db_prueba = pruebas_crud.get_prueba_by_id(db, id_prueba=id_prueba)
    if db_prueba is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return microorganismo_crud.update_microorganismo(db=db, id_microorganismo=id_microorganismo, microorganismo=microorganismo)

# Ruta para eliminar un microorganismo
@router.delete('/delete/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def delete_microorganismo(id_microorganismo: int, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return microorganismo_crud.delete_microorganismo(db=db, id_microorganismo=id_microorganismo)
