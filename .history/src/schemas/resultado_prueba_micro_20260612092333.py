from pydantic import BaseModel

# Se define la estructura minima de resultado_cuestionario
class ResultadoCuestBase(BaseModel):
    resultado: str

# Se agregan algunos datos para el cuestionario
class ResultadoCuest(ResultadoCuestBase):
    id_resultado: int
    id_prueba: int
    id_micro: int

    class Config:
        from_attributes: True

# Se necesitan las FK para cuestionario y prueba
class ResultadoCuestCreate(ResultadoCuestBase):
    id_micro: int
    id_prueba: int
