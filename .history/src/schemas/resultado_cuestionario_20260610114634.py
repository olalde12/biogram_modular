from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de resultado_cuestionario
class ResultadoCuestBase(BaseModel):
    resultado: str

# Se agregan algunos datos para el cuestionario
class ResultadoCuest(ResultadoCuestBase):
    id_prueba: int

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class ResultadoCuestCreate(PruebaBase):
    pass
