from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de una prueba bioquimica
class PruebaBase(BaseModel):
    nombre: str
    tipo_resultado: str
    fundamento: str
    tiempo_reaccion: str
    

# Se agregan algunos datos para el cuestionario
class Cuestionario(CuestionarioBase):
    id_cuestionario: int
    fecha: date
    id_usuario: int
    estado: bool

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class CuestionarioCreate(CuestionarioBase):
    id_usuario: int
