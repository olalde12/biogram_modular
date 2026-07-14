from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Publicaciones
from src.crud import usuario as usuario_crud
from src.crud import publicacion as publicacion_crud
from src.schemas import publicacion as publicacion_schema

router = APIRouter()

# Ruta para obtener todas las publicaciones
@router.get('/', response_model=List[publicacion_schema.Publicacion])
def read_publicaciones(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_publicaciones = (db.query(Publicaciones).filter(Publicaciones.id_usuario == id_usuario).all())
    if not db_publicaciones:
        raise HTTPException(status_code=404, detail='No hay publicaciones para mostrar')
    return db_publicaciones

# Ruta para obtener una publicacion por id
@router.get('/{id_publicacion}', response_model=publicacion_schema.Publicacion)
def read_publicacion_by_id(id_publicacion: int, db: Session = Depends(get_db)):
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=id_publicacion)
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail='Publicacion no encontrada')
    return db_publicacion

# Ruta para obtener una publicacion por titulo
@router.get('/name/{nombre}', response_model=cuestionarios_schema.Cuestionario)
def read_cuestionario_by_name(nombre: str, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionario = (db.query(Cuestionario).filter(
        Cuestionario.nombre == nombre,
        Cuestionario.id_usuario == id_usuario
    ).first())
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail='Cuestionario no encontrado')
    return db_cuestionario

# Ruta para crear un cuestionario
@router.post('/create', response_model=cuestionarios_schema.Cuestionario)
def create_cuestionario(cuestionario: cuestionarios_schema.CuestionarioCreate, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=cuestionario.id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionario = (db.query(Cuestionario).filter(
        Cuestionario.nombre == cuestionario.nombre,
        Cuestionario.id_usuario == cuestionario.id_usuario
    ).first())
    if db_cuestionario:
        raise HTTPException(status_code=400, detail='Ese cuestionario ya existe')
    return cuestionarios_crud.create_cuestionario(db=db, cuestionario=cuestionario)

# Ruta para modificar un cuestionario
@router.put("/update/{id_cuestionario}", response_model=cuestionarios_schema.Cuestionario)
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
