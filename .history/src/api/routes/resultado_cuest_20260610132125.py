from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Resultado_cuestionario
from src.crud import cuestionarios as cuestionario_crud
from src.crud import pruebas 
from src.crud import resultado_cuest as resultado_crud
from src.schemas import resultado_cuestionario as resultado_schema

router = APIRouter()

# Ruta para obtener todos los resultados
@router.get('/', response_model=List[resultado_schema.ResultadoCuest])
def read_resultado_cues(id_cuestionario: int, db: Session = Depends(get_db)):
    db_cuestionario = cuestionario_crud.get_cuestionario_by_id(db, id_cuestionario=id_cuestionario)
    if not db_cuestionario:
        raise HTTPException(status_code=404, detail='Ese cuestionario no exite')
    db_resultados = (db.query(Resultado_cuestionario).filter(Resultado_cuestionario.id_cuesti == id_cuestionario).all())
    if not db_resultados:
        raise HTTPException(status_code=404, detail='No hay resultados')
    return db_resultados

# Ruta para obtener un resultado por id
@router.get('/{id_rescues}', response_model=resultado_schema.ResultadoCuest)
def read_resultado_cuestionario_by_id(id_resultado: int, db: Session = Depends(get_db)):
    db_resultado = resultado_crud.get_rescues_by_id(db, id_resultado_cues=id_resultado)
    if db_resultado is None:
        raise HTTPException(status_code=404, detail='Sin resultados')
    return db_resultado

# Ruta para crear un resultado
@router.post('/create', response_model=resultado_schema.ResultadoCuest)
def create_resultado(resultado: resultado_schema.ResultadoCuestCreate, db: Session = Depends(get_db)):
    db_cuestionario = cuestionario_crud.get_cuestionario_by_id(db, id_cuestionario=resultado.id_cuesti)
    if not db_cuestionario:
        raise HTTPException(status_code=404, detail='Ese cuestionario no exite')
    db_prueba = pruebas.get_prueba_by_id(db, id_prueba=resultado.id_prueba)
    if not db_prueba:
        raise HTTPException(status_code=404, detail="Esa prueba no existe")
    db_resultado_existente = (db.query(Resultado_cuestionario).filter(
            Resultado_cuestionario.id_cuesti == resultado.id_cuesti,
            Resultado_cuestionario.id_prueba == resultado.id_prueba
        ).first())
    if db_resultado_existente:
        raise HTTPException(status_code=400, detail="Esa prueba ya está registrada")
    return resultado_crud.create_rescues(db=db, resultado=resultado)

# Ruta para modificar un resultado
@router.put("/update/{id_rescues}", response_model=resultado_schema.ResultadoCuest)
def update_resultado(id_resultado: int, resultado: resultado_schema.ResultadoCuestCreate, db: Session = Depends(get_db)):
    db_resultado = resultado_crud.get_rescues_by_id(db, id_resultado_cues=id_resultado)
    if db_resultado is None:
        raise HTTPException(status_code=404, detail="No existe tal resultado")
    db_cuestionario = cuestionario_crud.get_cuestionario_by_id(db, id_cuestionario=resultado.id_cuesti)
    if not db_cuestionario:
        raise HTTPException(status_code=404, detail="Ese cuestionario no existe")
    db_prueba = pruebas.get_prueba_by_id(db, id_prueba=resultado.id_prueba)
    if not db_prueba:
        raise HTTPException(status_code=404, detail="Esa prueba no existe")
    return resultado_crud.update_rescues(db=db, id_resultado_cues=id_resultado, resultado=resultado)

# Ruta para eliminar una resultado
@router.delete('/delete/{id_rescues}', response_model=resultado_schema.Prueba)
def delete_prueba(id_prueba: int, db: Session = Depends(get_db)):
    db_prueba = pruebas_crud.get_prueba_by_id(db, id_prueba=id_prueba)
    if db_prueba is None:
        raise HTTPException(status_code=404, detail='Prueba no encontrada')
    return pruebas_crud.delete_prueba(db=db, id_prueba=id_prueba)
