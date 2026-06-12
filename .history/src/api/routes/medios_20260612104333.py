from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import medios as medios_crud
from src.schemas import medio_cultivo as medios_schema

router = APIRouter()

# Ruta para obtener todas los medios
@router.get('/', response_model=List[medios_schema.Medio])
def read_medio(db: Session = Depends(get_db)):
    db_medio = medios_crud.get_medios(db)
    return db_medio

# Ruta para obtener un medio por id
@router.get('/{id_medio}', response_model=medios_schema.Medio)
def read_medio_by_id(id_medio: int, db: Session = Depends(get_db)):
    db_medio = medios_crud.get_medio_by_id(db, id_medio=id_medio)
    if db_medio is None:
        raise HTTPException(status_code=404, detail='Medio no encontrado')
    return db_medio

# Ruta para obtener un medio por nombre
@router.get('/name/{nombre}', response_model=medios_schema.Medio)
def read_medio_by_name(nombre: str, db: Session = Depends(get_db)):
    db_medio = medios_crud.get_medio_by_name(db, nombre=nombre)
    if db_medio is None:
        raise HTTPException(status_code=404, detail='Prueba no encontrada')
    return db_medio

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
        raise HTTPException(status_code=404, detail='Prueba no encontrada')
    return pruebas_crud.update_prueba(db=db, id_prueba=id_prueba, prueba=prueba)

# Ruta para eliminar una prueba
@router.delete('/delete/{id_prueba}', response_model=pruebas_schema.Prueba)
def delete_prueba(id_prueba: int, db: Session = Depends(get_db)):
    db_prueba = pruebas_crud.get_prueba_by_id(db, id_prueba=id_prueba)
    if db_prueba is None:
        raise HTTPException(status_code=404, detail='Prueba no encontrada')
    return pruebas_crud.delete_prueba(db=db, id_prueba=id_prueba)
