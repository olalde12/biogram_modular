from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Comentarios
from src.crud import comentario as comentario_crud
from src.crud import publicacion as publicacion_crud
from src.schemas import comentario as comentario_schema

router = APIRouter()

# Ruta para obtener todos los comentarios
@router.get('/', response_model=List[comentario_schema.Comentario])
def read_publicaciones(id_publicacion: int, db: Session = Depends(get_db)):
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=id_publicacion)
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
@router.get('/title/{titulo}', response_model=publicacion_schema.Publicacion)
def read_publicacion_by_title(titulo: str, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_publicacion = (db.query(Publicaciones).filter(
        Publicaciones.titulo == titulo,
        Publicaciones.id_usuario == id_usuario
    ).first())
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail='Publicacion no encontrada')
    return db_publicacion

# Ruta para crear una publicacion
@router.post('/create', response_model=publicacion_schema.Publicacion)
def create_publicacion(publicacion: publicacion_schema.PublicacionCreate, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=publicacion.id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_publicacion = (db.query(Publicaciones).filter(
        Publicaciones.titulo == publicacion.titulo,
        Publicaciones.contenido == publicacion.contenido,
        Publicaciones.id_usuario == publicacion.id_usuario
    ).first())
    if db_publicacion:
        raise HTTPException(status_code=400, detail='Esa publicacion ya existe')
    return publicacion_crud.create_publicacion(db=db, publicacion=publicacion)

# Ruta para modificar una publicacion
@router.put("/update/{id_publicacion}", response_model=publicacion_schema.Publicacion)
def update_publicacion(id_publicacion: int, publicacion: publicacion_schema.PublicacionCreate, db: Session = Depends(get_db)):
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=id_publicacion)
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail="Esa publicacion no existe")
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=publicacion.id_usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Ese usuario no existe")
    db_publicacion_existente = (db.query(Publicaciones).filter(
            Publicaciones.titulo == publicacion.titulo,
            Publicaciones.contenido == publicacion.contenido,
            Publicaciones.id_usuario == publicacion.id_usuario,
            Publicaciones.id_publicacion != id_publicacion 
        ).first())
    if db_publicacion_existente:
        raise HTTPException(status_code=400, detail="Esa publicacion ya existe")
    return publicacion_crud.update_publicacion(db=db, id_publicacion=id_publicacion, publicacion=publicacion)

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
