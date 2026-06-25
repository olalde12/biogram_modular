from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import usuario as usuario_crud
from src.schemas import usuarios as usuarios_schema

router = APIRouter()

# Ruta para obtener un usuario por id
@router.get('/{id_usuario}', response_model=usuarios_schema.Usuario)
def read_usuario_by_id(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return db_usuario

# Ruta para obtener un usuario por nombre
@router.get('/name/{nombre}', response_model=usuarios_schema.Usuario)
def read_usuario_by_name(nombre: str, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_name(db, nombre=nombre)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return db_usuario

# Ruta para crear a un usuario
@router.post('/create', response_model=usuarios_schema.Usuario)
def create_usuario(usuario: usuarios_schema.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_name(db, nombre=usuario.nombre)
    if db_usuario:
        raise HTTPException(status_code=400, detail='Ese microorganismo ya existe')
    return usuario_crud.create_usuario(db=db, usuario=usuario)

# Ruta para modificar a un usuario
@router.put('/update/{id_usuario}', response_model=usuarios_schema.Usuario)
def update_usuario(id_usuario: int, usuario: usuarios_schema.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return usuario_crud.update_usuario(db=db, id_usuario=id_usuario, usuario=usuario)

# Ruta para eliminar un usuario
@router.delete('/delete/{id_usuario}', response_model=usuarios_schema.Usuario)
def delete_usuario(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return usuario_crud.delete_usuario(db=db, id_microorganismo=id_microorganismo)
