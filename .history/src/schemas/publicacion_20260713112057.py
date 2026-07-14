from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de una publicacion
class PublicacionBase(BaseModel):
    titulo: str
    contenido: str
    : str
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
