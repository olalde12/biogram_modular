from datetime import date

from pydantic import BaseModel

# Se define la estructura minima de un usuario
class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    correo: str
    contraseña: str
    tipo: bool

# Se agrega el identificador a los campos
class Usuario(UsuarioBase):
    id_usuario: int
    fecha_registro: date

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class UsuarioCreate(UsuarioBase):
    pass
