from datetime import date
from pydantic import BaseModel
from typing import List, Optional

# Se define la estructura minima de un cuestionario
class CuestionarioBase(BaseModel):
    nombre: str

# Se agregan algunos datos para el cuestionario
class Cuestionario(CuestionarioBase):
    id_cuestionario: int
    fecha: date
    id_usuario: int
    porcentaje_coincidencia: Optional[float] = None

    class Config:
        from_attributes: True

# Se necesita el campo para el usuario (FK)
class CuestionarioCreate(CuestionarioBase):
    id_usuario: int

class CuestionarioUpdate(CuestionarioBase):
    nombre: str    

# Esquema para cada respuesta de una identificación
class RespuestaIdentificacion(BaseModel):
    id_prueba: Optional[int] = None
    tipo: str
    resultado: str

# Esquema para guardar una identificación completa
class IdentificacionGuardar(BaseModel):
    nombre: str
    porcentaje_coincidencia: Optional[float] = None
    respuestas: List[RespuestaIdentificacion]
