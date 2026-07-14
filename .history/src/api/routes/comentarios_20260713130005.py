from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Comentarios
from src.crud import comentario as comentario_crud
from src.crud import publicacion as publicacion_crud
from src.crud import usuario as usuario_crud
from src.schemas import comentario as comentario_schema

router = APIRouter()

# Ruta para obtener todos los comentarios
@router.get('/', response_model=List[comentario_schema.Comentario])
def read_publicaciones(id_publicacion: int, db: Session = Depends(get_db)):
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=id_publicacion)
    if not db_publicacion:
        raise HTTPException(status_code=404, detail='Esa publicacion no exite')
    db_comentarios = (db.query(Comentarios).filter(Comentarios.id_publicacion == id_publicacion).all())
    if not db_comentarios:
        raise HTTPException(status_code=404, detail='No hay comentarios para mostrar')
    return db_comentarios

# Ruta para obtener un comentario por id
@router.get('/{id_comentario}', response_model=comentario_schema.Comentario)
def read_comentario_by_id(id_comentario: int, db: Session = Depends(get_db)):
    db_comentario = comentario_crud.get_comentario_by_id(db, id_comentario=id_comentario)
    if db_comentario is None:
        raise HTTPException(status_code=404, detail='Comentario no encontrado')
    return db_comentario

# Ruta para crear un comentario
@router.post('/create', response_model=comentario_schema.Comentario)
def create_comentario(comentario: comentario_schema.ComentarioCreate, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=comentario.id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=comentario.id_publicacion)
    if not db_publicacion:
        raise HTTPException(status_code=404, detail='Esa publicacion no existe')
    return comentario_crud.create_comentario(db=db, comentario=comentario)

# Ruta para modificar un comentario
@router.put("/update/{id_comentario}", response_model=comentario_schema.Comentario)
def update_comentario(id_comentario: int, comentario: comentario_schema.ComentarioCreate, db: Session = Depends(get_db)):
    db_comentario = comentario_crud.get_comentario_by_id(db, id_comentario=id_comentario)
    if db_comentario is None:
        raise HTTPException(status_code=404, detail="Ese comentario no existe")
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=comentario.id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Ese usuario no existe")
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=comentario.id_publicacion)
    if not db_publicacion:
        raise HTTPException(status_code=404, detail="Esa publicacion no existe")
    return comentario_crud.update_comentario(db=db, id_=id_publicacion, publicacion=publicacion)

# Ruta para eliminar una publicacion
@router.delete('/delete/{id_publicacion}', response_model=publicacion_schema.Publicacion)
def delete_publicacion(id_publicacion: int, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_publicacion = (db.query(Publicaciones).filter(
        Publicaciones.id_publicacion == id_publicacion,
        Publicaciones.id_usuario == id_usuario
    ).first())
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail='Publicacion no encontrada')
    return publicacion_crud.delete_publicacion(db=db, id_publicacion=id_publicacion)
