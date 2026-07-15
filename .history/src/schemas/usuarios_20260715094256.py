from datetime import date
from pydantic import BaseModel, EmailStr

# Se define la estructura minima de un usuario
class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    correo: Email
    contraseña: str

# Se agrega el identificador y la fecha a los campos
class Usuario(UsuarioBase):
    id_usuario: int
    fecha_registro: date
    estado: bool

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class UsuarioCreate(UsuarioBase):
    pass
