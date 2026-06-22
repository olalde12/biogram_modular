from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de un cuestionario
class CuestionarioBase(BaseModel):
    nombre: str

# Se agrega el identificador y la fecha a los campos
class Cuestionario(CuestionarioBase):
    id_cuestionario: int
    fecha: date
    id_usuario: int
    estado: bool

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class CuestionarioCreate(CuestionarioBase):
    id_cuestionario: int
