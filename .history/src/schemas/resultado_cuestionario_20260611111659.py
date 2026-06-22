from pydantic import BaseModel

# Se define la estructura minima de resultado_cuestionario
class ResultadoCuestBase(BaseModel):

    resultado: str

# Se agregan algunos datos para el cuestionario
class ResultadoCuest(ResultadoCuestBase):
    id_prueba: int
    id_cuesti: int

    class Config:
        from_attributes: True

# Se necesitan las FK para cuestionario y prueba
class ResultadoCuestCreate(ResultadoCuestBase):
    id_cuesti: int
    id_prueba: int
