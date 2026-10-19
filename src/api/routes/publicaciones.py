from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Publicaciones, Usuarios, Likes
from src.crud import usuario as usuario_crud
from src.crud import publicacion as publicacion_crud
from src.schemas import publicacion as publicacion_schema

router = APIRouter()

# Ruta para obtener todas las publicaciones
@router.get('/', response_model=List[publicacion_schema.Publicacion])
def read_publicaciones(db: Session = Depends(get_db)):
    db_publicaciones = (db.query(Publicaciones, Usuarios.nombre, Usuarios.avatar).join(Usuarios, Publicaciones.id_usuario == Usuarios.id_usuario).all())
    resultado = []
    for publicacion, nombre, avatar in db_publicaciones:
        total_likes = db.query(func.count(Likes.id_likes)).filter(
                    Likes.id_publicacion == publicacion.id_publicacion
                ).scalar() or 0
        resultado.append({
            "id_publicacion": publicacion.id_publicacion,
            "titulo": publicacion.titulo,
            "contenido": publicacion.contenido,
            "categoria": publicacion.categoria,
            "fecha_creacion": publicacion.fecha_creacion,
            "id_usuario": publicacion.id_usuario,
            "autor": nombre,
            "avatar": avatar,
            "likes": total_likes,
            "respuestas": len(publicacion.comentarios)
        })
    return resultado

# Ruta para obtener todas las publicaciones de un usuario
@router.get('/usuario/{id_usuario}', response_model=List[publicacion_schema.Publicacion])
def read_publicaciones_usuario(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_publicaciones = (db.query(Publicaciones).filter(Publicaciones.id_usuario == id_usuario).all())
    if not db_publicaciones:
        raise HTTPException(status_code=404, detail='No hay publicaciones para mostrar')
    return db_publicaciones

# Ruta para obtener una publicacion por id
@router.get('/publicacion/{id_publicacion}', response_model=publicacion_schema.Publicacion)
def read_publicacion_by_id(id_publicacion: int, db: Session = Depends(get_db)):
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=id_publicacion)
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail='Publicacion no encontrada')
    return db_publicacion

# Ruta para obtener una publicacion por titulo
@router.get('/titulo/{titulo}', response_model=List[publicacion_schema.Publicacion])
def read_publicacion_by_title(titulo: str, db: Session = Depends(get_db)):
    db_publicacion = (db.query(Publicaciones).filter(
        func.lower(Publicaciones.titulo) == titulo.lower()
    ).all())
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail='Publicacion no encontrada')
    return db_publicacion

# Ruta para obtener una publicacion por categoria
@router.get('/categoria/{categoria}', response_model=List[publicacion_schema.Publicacion])
def read_publicacion_by_title(categoria: str, db: Session = Depends(get_db)):
    db_publicaciones = (db.query(Publicaciones, Usuarios.nombre, Usuarios.avatar).join(Usuarios, Publicaciones.id_usuario == Usuarios.id_usuario).filter(
        func.lower(Publicaciones.categoria) == categoria.lower()
    ).all())
    resultado = []
    for publicacion, nombre, avatar in db_publicaciones:
        total_likes = db.query(func.count(Likes.id_likes)).filter(
            Likes.id_publicacion == publicacion.id_publicacion
        ).scalar() or 0
        resultado.append({
            "id_publicacion": publicacion.id_publicacion,
            "titulo": publicacion.titulo,
            "contenido": publicacion.contenido,
            "categoria": publicacion.categoria,
            "fecha_creacion": publicacion.fecha_creacion,
            "id_usuario": publicacion.id_usuario,
            "autor": nombre,
            "avatar": avatar,
            "likes": total_likes,
            "respuestas": len(publicacion.comentarios)
        })
    return resultado

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
    nueva = publicacion_crud.create_publicacion(db=db, publicacion=publicacion)
    return {
        "id_publicacion": nueva.id_publicacion,
        "titulo": nueva.titulo,
        "contenido": nueva.contenido,
        "categoria": nueva.categoria,
        "fecha_creacion": nueva.fecha_creacion,
        "id_usuario": nueva.id_usuario,
        "autor": db_usuario.nombre,   
        "avatar": db_usuario.avatar   
    }

# Ruta para modificar una publicacion
@router.put("/update/{id_publicacion}", response_model=publicacion_schema.Publicacion)
def update_publicacion(id_publicacion: int, id_usuario: int, publicacion: publicacion_schema.PublicacionUpdate, db: Session = Depends(get_db)):
    db_publicacion = publicacion_crud.get_publicacion_by_id(db, id_publicacion=id_publicacion)
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail="Esa publicacion no existe")
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail="Ese usuario no existe")
    if db_publicacion.id_usuario != id_usuario:
        raise HTTPException(status_code=403, detail="Esa publicacion no pertenece a ese usuario")
    db_publicacion_existente = (db.query(Publicaciones).filter(
            Publicaciones.titulo == publicacion.titulo,
            Publicaciones.contenido == publicacion.contenido,
            Publicaciones.id_usuario == id_usuario,
            Publicaciones.id_publicacion != id_publicacion 
        ).first())
    if db_publicacion_existente:
        raise HTTPException(status_code=400, detail="Esa publicacion ya existe")
    return publicacion_crud.update_publicacion(db=db, id_publicacion=id_publicacion, publicacion=publicacion)

# Ruta para eliminar una publicacion
@router.delete('/delete/{id_publicacion}', response_model=publicacion_schema.Publicacion)
def delete_publicacion(id_publicacion: int, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_publicacion = (db.query(Publicaciones).filter(
        Publicaciones.id_publicacion == id_publicacion,
        Publicaciones.id_usuario == id_usuario
    ).first())
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail='Publicacion no encontrada')
    datos_publicacion = {
        "id_publicacion": db_publicacion.id_publicacion,
        "titulo": db_publicacion.titulo,
        "contenido": db_publicacion.contenido,
        "categoria": db_publicacion.categoria,
        "fecha_creacion": db_publicacion.fecha_creacion,
        "id_usuario": db_publicacion.id_usuario,
        "autor": db_usuario.nombre,
        "avatar": getattr(db_usuario, "avatar", None)
    }
    publicacion_crud.delete_publicacion(db=db, id_publicacion=id_publicacion)
    return datos_publicacion


# Consultar el total y saber si un usuario ya dio Me gusta
@router.get("/{id_publicacion}/likes")
def consultar_me_gusta(
    id_publicacion: int,
    id_usuario: int,
    db: Session = Depends(get_db)
):
    publicacion = db.query(Publicaciones).filter(
        Publicaciones.id_publicacion == id_publicacion
    ).first()

    if not publicacion:
        raise HTTPException(
            status_code=404,
            detail="Publicación no encontrada"
        )

    total = db.query(func.count(Likes.id_likes)).filter(
        Likes.id_publicacion == id_publicacion
    ).scalar() or 0

    reaccion = db.query(Likes).filter(
        Likes.id_publicacion == id_publicacion,
        Likes.id_usuario == id_usuario
    ).first()

    return {
        "likes": total,
        "liked": reaccion is not None
    }


# Dar o quitar Me gusta
@router.post("/{id_publicacion}/likes")
def alternar_me_gusta(
    id_publicacion: int,
    id_usuario: int,
    db: Session = Depends(get_db)
):
    publicacion = db.query(Publicaciones).filter(
        Publicaciones.id_publicacion == id_publicacion
    ).first()

    if not publicacion:
        raise HTTPException(
            status_code=404,
            detail="Publicación no encontrada"
        )

    usuario = db.query(Usuarios).filter(
        Usuarios.id_usuario == id_usuario
    ).first()

    if not usuario or usuario.estado is False:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    reaccion = db.query(Likes).filter(
        Likes.id_publicacion == id_publicacion,
        Likes.id_usuario == id_usuario
    ).first()

    if reaccion:
        db.delete(reaccion)
        liked = False
    else:
        nueva_reaccion = Likes(
            id_publicacion=id_publicacion,
            id_usuario=id_usuario
        )
        db.add(nueva_reaccion)
        liked = True

    db.commit()

    total = db.query(func.count(Likes.id_likes)).filter(
        Likes.id_publicacion == id_publicacion
    ).scalar() or 0

    return {
        "likes": total,
        "liked": liked
    }