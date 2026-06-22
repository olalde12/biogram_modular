from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de un usuario
class CuestionarioBase(BaseModel):
    nombre: str

# Se agrega el identificador y la fecha a los campos
class Cuestionario(CuestionarioBase):
    id_cuestionario: int
    fecha: date
    id_usuario: int
    estado_bool

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class UsuarioCreate(CuestionarioBase):
    id_usuario: int
