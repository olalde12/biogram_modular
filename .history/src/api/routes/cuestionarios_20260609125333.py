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
    db_cuestionario = cuestionarios_crud.get_cuestionario_by_id(db, id_cuestionario=id_usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return db_usuario

# Ruta para crear a un usuario
@router.post('/create', response_model=usuarios_schema.Usuario)
def create_usuario(usuario: usuarios_schema.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuarios).filter(Usuarios.correo == usuario.correo).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail='Ese correo ya existe')
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
    return usuario_crud.delete_usuario(db=db, id_usuario=id_usuario)
