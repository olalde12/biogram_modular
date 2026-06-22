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
    db_resultados = (db.query(Resultado_cuestionario).filter(Resultado_cuestionario.id_resultado_cues == id_cuestionario).all())
    if not db_resultados:
        raise HTTPException(status_code=404, detail='No hay resultados')
    return db_resultados

# Ruta para obtener un resultado por id
@router.get('/{id_rescues}', response_model=resultado_schema.ResultadoCuest)
def read_resultado_cuestionario_by_id(id_resultado: int, db: Session = Depends(get_db)):
    db_resultado = resultado_crud.get_resultado_by_id(db, id_resultado=id_resultado)
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
    return resultado_crud.create_rescues(db=db, resultado=resultado)

# Ruta para modificar un resultado
@router.put("/update/{id_rescues}", response_model=cuestionarios_schema.Cuestionario)
def update_cuestionario(id_cuestionario: int, cuestionario: cuestionarios_schema.CuestionarioCreate, db: Session = Depends(get_db)):
    db_cuestionario = cuestionarios_crud.get_cuestionario_by_id(db, id_cuestionario=id_cuestionario)
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail="Ese cuestionario no existe")
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=cuestionario.id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Ese usuario no existe")
    db_cuestionario_existente = (db.query(Cuestionario).filter(
            Cuestionario.nombre == cuestionario.nombre,
            Cuestionario.id_usuario == cuestionario.id_usuario,
            Cuestionario.id_cuestionario != id_cuestionario 
        ).first())
    if db_cuestionario_existente:
        raise HTTPException(status_code=400, detail="Ese cuestionario ya existe")
    return cuestionarios_crud.update_cuestionario(db=db, id_cuestionario=id_cuestionario, cuestionario=cuestionario)

# Ruta para eliminar un cuestionario
@router.delete('/delete/{id_cuestionario}', response_model=cuestionarios_schema.Cuestionario)
def delete_cuestionario(id_cuestionario: int, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionario = (db.query(Cuestionario).filter(
        Cuestionario.id_cuestionario == id_cuestionario,
        Cuestionario.id_usuario == id_usuario
    ).first())
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail='Cuestionario no encontrado')
    return cuestionarios_crud.delete_cuestionario(db=db, id_cuestionario=id_cuestionario)
