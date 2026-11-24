from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from src.seguridad.password import verificar_password_compatible
from src.api.deps import get_db
from src.crud import usuario as usuario_crud
from src.schemas import usuarios as usuarios_schema
from pydantic import EmailStr
import re, time

router = APIRouter()

# Ruta para obtener un usuario por id
@router.get('/id/{id}', response_model=usuarios_schema.Usuario)
def read_usuario_by_id(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if db_usuario is None or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return db_usuario

# Ruta para obtener un usuario por correo
@router.get('/email/{email}', response_model=usuarios_schema.Usuario)
def read_usuario_by_email(email: EmailStr, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_email(db, email=email)
    if db_usuario is None or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return db_usuario

# Ruta para crear a un usuario
@router.post('/create', response_model=usuarios_schema.Usuario)
def create_usuario(usuario: usuarios_schema.UsuarioCreate, request:Request, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_email(db, usuario.correo)
    if db_usuario:
        raise HTTPException(status_code=409, detail='Ese correo ya existe')
    regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    if not re.match(regex, usuario.contraseña):
        raise HTTPException(status_code=400, detail='La contraseña debe contener 8 caracteres, mayúscula, minúscula, número y símbolo')
    regex2 = r'^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$'
    if not re.match(regex2, usuario.nombre):
        raise HTTPException(status_code=400, detail="El nombre solo debe contener letras")
    if not re.match(regex2, usuario.apellido):
        raise HTTPException(status_code=400, detail="El apellido solo debe contener letras")
    db_usuario = usuario_crud.create_usuario(db=db, usuario=usuario)
    request.session.clear()
    request.session["id_usuario"] = db_usuario.id_usuario
    request.session["expira_en"] = time.time() + (60 * 60 * 12)
    return db_usuario

# Ruta para modificar a un usuario
@router.put('/update/{id_usuario}', response_model=usuarios_schema.Usuario)
def update_usuario(id_usuario: int, usuario: usuarios_schema.UsuarioUpdate, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    elif db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    if usuario.contraseña is not None:
        regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        if not re.match(regex, usuario.contraseña):
            raise HTTPException(status_code=400, detail="La contraseña debe contener 8 caracteres, mayúscula, minúscula, número y símbolo")
    regex2 = r'^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$'
    if usuario.nombre is not None:
        if not re.match(regex2, usuario.nombre):
            raise HTTPException(status_code=400, detail="El nombre solo debe contener letras")
    if usuario.apellido is not None:
        if not re.match(regex2, usuario.apellido):
            raise HTTPException(status_code=400, detail="El apellido solo debe contener letras")
    return usuario_crud.update_usuario(db=db, id_usuario=id_usuario, usuario=usuario)

# Ruta para modificar el avatar de un usuario
@router.put('/update-avatar', response_model=usuarios_schema.Usuario)
def update_avatar(data: usuarios_schema.AvatarUpdate, request: Request, db: Session = Depends(get_db)):
    id_usuario = request.session.get("id_usuario")
    if not id_usuario:
        raise HTTPException(status_code=401, detail="No autenticado")
    usuario = usuario_crud.get_usuario_by_id(db, id_usuario)
    if not usuario or usuario.estado is False:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.avatar = data.avatar
    db.commit()
    db.refresh(usuario)
    return usuario

# Ruta para eliminar un usuario
@router.delete('/delete/{id_usuario}', response_model=usuarios_schema.Usuario)
def delete_usuario(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return usuario_crud.delete_usuario(db=db, id_usuario=id_usuario)

# Ruta para iniciar sesion
@router.post("/login")
def login(data: usuarios_schema.login, request: Request, db: Session = Depends(get_db)):
    usuario = usuario_crud.get_usuario_by_email(db, data.correo)
    if not usuario or usuario.estado is False:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    valido, nuevo_hash =verificar_password_compatible(data.contraseña, usuario.contraseña)
    if not valido:
        raise HTTPException(status_code=401, detail="Contraseñas incorrectas")
    if nuevo_hash:
        usuario.contraseña = nuevo_hash
        db.commit()
    request.session.clear()
    request.session["id_usuario"] = usuario.id_usuario
    if data.recordar:
        duracion = 60 * 60 * 24 * 30  
    else:
        duracion = 60 * 60 * 12 
    request.session["expira_en"] = time.time() + duracion
    return {
        "message": "Login correcto"
    }

# Ruta para cerrar sesion
@router.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/", status_code=303)
