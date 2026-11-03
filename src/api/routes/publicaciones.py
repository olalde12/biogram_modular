from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, case
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Publicaciones, Usuarios, Likes, Comentarios
from src.crud import usuario as usuario_crud
from src.crud import publicacion as publicacion_crud
from src.schemas import publicacion as publicacion_schema
from src.moderacion import contenido_moderado

router = APIRouter()


# Consulta optimizada reutilizable para las publicaciones
def consultar_publicaciones(db: Session, categoria: str = None):
    # Contar los likes de cada publicación en una sola subconsulta
    likes_subquery = (
        db.query(
            Likes.id_publicacion.label("id_publicacion"),
            func.count(Likes.id_likes).label("total_likes")
        )
        .group_by(Likes.id_publicacion)
        .subquery()
    )

    # Contar los comentarios/respuestas de cada publicación
    respuestas_subquery = (
        db.query(
            Comentarios.id_publicacion.label("id_publicacion"),
            func.count(Comentarios.id_comentario).label("total_respuestas")
        )
        .group_by(Comentarios.id_publicacion)
        .subquery()
    )

    consulta = (
        db.query(
            Publicaciones,
            Usuarios.nombre,
            Usuarios.avatar,
            func.coalesce(likes_subquery.c.total_likes, 0).label("likes"),
            func.coalesce(
                respuestas_subquery.c.total_respuestas, 0
            ).label("respuestas")
        )
        .join(
            Usuarios,
            Publicaciones.id_usuario == Usuarios.id_usuario
        )
        .outerjoin(
            likes_subquery,
            Publicaciones.id_publicacion == likes_subquery.c.id_publicacion
        )
        .outerjoin(
            respuestas_subquery,
            Publicaciones.id_publicacion == respuestas_subquery.c.id_publicacion
        )
    )

    if categoria:
        consulta = consulta.filter(
            func.lower(Publicaciones.categoria) == categoria.lower()
        )

    filas = consulta.order_by(
        Publicaciones.fecha_creacion.desc()
    ).all()

    resultado = []

    for publicacion, nombre, avatar, likes, respuestas in filas:
        resultado.append({
            "id_publicacion": publicacion.id_publicacion,
            "titulo": publicacion.titulo,
            "contenido": publicacion.contenido,
            "categoria": publicacion.categoria,
            "fecha_creacion": publicacion.fecha_creacion,
            "id_usuario": publicacion.id_usuario,
            "autor": nombre,
            "avatar": avatar,
            "likes": likes,
            "respuestas": respuestas
        })

    return resultado


# Obtener todas las publicaciones
@router.get("/", response_model=List[publicacion_schema.Publicacion])
def read_publicaciones(db: Session = Depends(get_db)):
    return consultar_publicaciones(db)


# Obtener publicaciones por categoría
@router.get(
    "/categoria/{categoria}",
    response_model=List[publicacion_schema.Publicacion]
)
def read_publicaciones_categoria(
    categoria: str,
    db: Session = Depends(get_db)
):
    return consultar_publicaciones(db, categoria)


# Ruta para obtener todas las publicaciones de un usuario
@router.get('/usuario/{id_usuario}', response_model=List[publicacion_schema.Publicacion])
def read_publicaciones_usuario(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    publicaciones = consultar_publicaciones(db)
    return [
        publicacion
        for publicacion in publicaciones
        if publicacion["id_usuario"] == id_usuario
    ]

# Ruta para obtener una publicacion por id
@router.get('/publicacion/{id_publicacion}', response_model=publicacion_schema.Publicacion)
def read_publicacion_by_id(id_publicacion: int, db: Session = Depends(get_db)):
    resultado = consultar_publicaciones(db)
    publicacion = next(
        (
            p for p in resultado
            if p["id_publicacion"] == id_publicacion
        ),
        None
    )
    if publicacion is None:
        raise HTTPException(status_code=404, detail='Publicacion no encontrada')
    return publicacion

# Ruta para obtener una publicacion por titulo
@router.get('/titulo/{titulo}', response_model=List[publicacion_schema.Publicacion])
def read_publicacion_by_title(titulo: str, db: Session = Depends(get_db)):
    publicaciones = consultar_publicaciones(db)
    return [
        p for p in publicaciones
        if p["titulo"].lower() == titulo.lower()
    ]

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
    if contenido_moderado(publicacion.contenido) or contenido_moderado(publicacion.titulo):
        raise HTTPException(status_code=400, detail=("Tu publicación contiene contenido que no cumple las normas de la comunidad."))
    if db_publicacion:
        raise HTTPException(status_code=409, detail='Esa publicacion ya existe')
    nueva = publicacion_crud.create_publicacion(db=db, publicacion=publicacion)
    return {
        "id_publicacion": nueva.id_publicacion,
        "titulo": nueva.titulo,
        "contenido": nueva.contenido,
        "categoria": nueva.categoria,
        "fecha_creacion": nueva.fecha_creacion,
        "id_usuario": nueva.id_usuario,
        "autor": db_usuario.nombre,   
        "avatar": db_usuario.avatar,
        "likes": 0,
        "respuestas": 0
    }

# Ruta para modificar una publicacion
@router.put("/update/{id_publicacion}", response_model=publicacion_schema.Publicacion)
def update_publicacion(
    id_publicacion: int,
    id_usuario: int,
    publicacion: publicacion_schema.PublicacionUpdate,
    db: Session = Depends(get_db)
):
    # Buscar la publicación
    db_publicacion = publicacion_crud.get_publicacion_by_id(
        db, id_publicacion=id_publicacion
    )

    if db_publicacion is None:
        raise HTTPException(
            status_code=404,
            detail="Esa publicación no existe"
        )

    # Verificar que el usuario exista y esté activo
    db_usuario = usuario_crud.get_usuario_by_id(
        db, id_usuario=id_usuario
    )

    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(
            status_code=404,
            detail="Ese usuario no existe"
        )

    # Verificar que la publicación pertenezca al usuario
    if db_publicacion.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Esa publicación no pertenece a ese usuario"
        )

    # Obtener únicamente los campos enviados
    datos = publicacion.model_dump(exclude_unset=True)

    # Moderar los campos que se desean modificar
    for campo in ("titulo", "contenido"):
        if campo in datos and datos[campo] is not None:
            if contenido_moderado(datos[campo]):
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Tu publicación contiene contenido que "
                        "no cumple las normas de la comunidad."
                    )
                )

    # Comprobar duplicados únicamente por título
    if "titulo" in datos and datos["titulo"] is not None:
        db_publicacion_existente = db.query(
            Publicaciones.id_publicacion
        ).filter(
            Publicaciones.titulo == datos["titulo"],
            Publicaciones.id_usuario == id_usuario,
            Publicaciones.id_publicacion != id_publicacion
        ).first()

        if db_publicacion_existente:
            raise HTTPException(
                status_code=409,
                detail="Ya tienes una publicación con ese título"
            )

    # Actualizar la publicación
    actualizada = publicacion_crud.update_publicacion(
        db=db,
        id_publicacion=id_publicacion,
        publicacion=publicacion,
        db_publicacion=db_publicacion
    )

    return {
        "id_publicacion": actualizada.id_publicacion,
        "titulo": actualizada.titulo,
        "contenido": actualizada.contenido,
        "categoria": actualizada.categoria,
        "fecha_creacion": actualizada.fecha_creacion,
        "id_usuario": actualizada.id_usuario,
        "autor": db_usuario.nombre,
        "avatar": db_usuario.avatar,
        "respuestas": len(actualizada.comentarios)
    }

# Ruta para eliminar una publicacion
@router.delete("/delete/{id_publicacion}", response_model=publicacion_schema.Publicacion)
def delete_publicacion(id_publicacion: int, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail="Ese usuario no existe")
    db_publicacion = db.query(Publicaciones).filter(
        Publicaciones.id_publicacion == id_publicacion,
        Publicaciones.id_usuario == id_usuario
    ).first()
    if db_publicacion is None:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    # Contar respuestas sin cargar todos los comentarios
    total_respuestas = db.query(
        func.count(Comentarios.id_comentario)
    ).filter(
        Comentarios.id_publicacion == id_publicacion
    ).scalar() or 0
    datos_publicacion = {
        "id_publicacion": db_publicacion.id_publicacion,
        "titulo": db_publicacion.titulo,
        "contenido": db_publicacion.contenido,
        "categoria": db_publicacion.categoria,
        "fecha_creacion": db_publicacion.fecha_creacion,
        "id_usuario": db_publicacion.id_usuario,
        "autor": db_usuario.nombre,
        "avatar": getattr(db_usuario, "avatar", None),
        "likes": db.query(func.count(Likes.id_likes)).filter(
            Likes.id_publicacion == id_publicacion
        ).scalar() or 0,
        "respuestas": total_respuestas
    }
    publicacion_crud.delete_publicacion(db=db, id_publicacion=id_publicacion)
    return datos_publicacion

# Consultar el total y saber si un usuario ya dio me gusta

# Consultar el total de likes y si el usuario ya reaccionó
@router.get("/{id_publicacion}/likes")
def consultar_me_gusta(
    id_publicacion: int,
    id_usuario: int,
    db: Session = Depends(get_db)
):
    resultado = (
        db.query(
            Publicaciones.id_publicacion,
            func.count(Likes.id_likes).label("total_likes"),
            func.max(
                case(
                    (Likes.id_usuario == id_usuario, 1),
                    else_=0
                )
            ).label("liked")
        )
        .outerjoin(
            Likes,
            Likes.id_publicacion == Publicaciones.id_publicacion
        )
        .filter(
            Publicaciones.id_publicacion == id_publicacion
        )
        .group_by(Publicaciones.id_publicacion)
        .first()
    )

    if resultado is None:
        raise HTTPException(
            status_code=404,
            detail="Publicación no encontrada"
        )

    return {
        "likes": resultado.total_likes,
        "liked": bool(resultado.liked)
    }




# Dar o quitar Me gusta
@router.post("/{id_publicacion}/likes")
def alternar_me_gusta(
    id_publicacion: int,
    id_usuario: int,
    db: Session = Depends(get_db)
):
    publicacion = db.query(
        Publicaciones.id_publicacion
    ).filter(
        Publicaciones.id_publicacion == id_publicacion
    ).first()

    if publicacion is None:
        raise HTTPException(
            status_code=404,
            detail="Publicación no encontrada"
        )

    usuario = db.query(Usuarios.id_usuario).filter(
        Usuarios.id_usuario == id_usuario,
        Usuarios.estado.isnot(False)
    ).first()

    if usuario is None:
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

    total = db.query(
        func.count(Likes.id_likes)
    ).filter(
        Likes.id_publicacion == id_publicacion
    ).scalar() or 0

    return {
        "likes": total,
        "liked": liked
    }

