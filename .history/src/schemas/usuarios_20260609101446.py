from pydantic import BaseModel

# Se define la estructura minima de un usuario
class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    correo: str
    descripcion: str
    imagen: str
    tipo: str

# Se agrega el identificador a los campos
class Usuario(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class UsuarioCreate(UsuarioBase):
    pass
