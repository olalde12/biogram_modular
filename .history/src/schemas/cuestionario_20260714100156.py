from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de un cuestionario
class CuestionarioBase(BaseModel):
    nombre: str

# Se agregan algunos datos para el cuestionario
class Cuestionario(CuestionarioBase):
    id_cuestionario: int
    fecha: date
    id_usuario: int
    estado: bool

    class Config:
        from_attributes: True

# Se necesita el campo para el usuario (FK)
class CuestionarioCreate(CuestionarioBase):
    id_usuario: int

class CuestionarioUpdate(CuestionarioBase)    
