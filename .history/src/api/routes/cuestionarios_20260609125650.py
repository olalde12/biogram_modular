from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import cuestionarios as cuestionarios_crud
from src.schemas import cuestionario as cuestionarios_schema

router = APIRouter()

# Ruta para obtener todos los cuestionarios
@router.get('/', response_model=List[cuestionarios_schema.Cuestionario])
def read_cuestionarios(db: Session = Depends(get_db)):
    return cuestionarios_crud.get_cuestionarios(db)

# Ruta para obtener un cuestionario por id
@router.get('/{id_cuestionario}', response_model=cuestionarios_schema.Cuestionario)
def read_cuestionario_by_id(id_cuestionario: int, db: Session = Depends(get_db)):
    db_cuestionario = cuestionarios_crud.get_cuestionario_by_id(db, id_cuestionario=id_cuestionario)
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail='Cuestionario no encontrado')
    return db_cuestionario

# Ruta para obtener un cuestionario por nombre
@router.get('/name/{nombre}', response_model=cuestionarios_schema.Cuestionario)
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

# Ruta para eliminar un cuestionario
@router.delete('/delete/{id_usuario}', response_model=usuarios_schema.Usuario)
def delete_usuario(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return usuario_crud.delete_usuario(db=db, id_usuario=id_usuario)
