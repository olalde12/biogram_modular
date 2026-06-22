from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de prueba_cuestionario
class PruebaCuestBase(BaseModel):
    nombre: str
    tipo_resultado: str
    fundamento: str
    tiempo_reaccion: str
    descripcion: str

# Se agregan algunos datos para el cuestionario
class Prueba(PruebaBase):
    id_prueba: int

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class PruebaCreate(PruebaBase):
    pass
