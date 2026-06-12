from pydantic import BaseModel

# Se define la estructura minima de resultado_prueba_micro
class ResultadoBase(BaseModel):
    resultado: str

# Se agregan algunos datos para el cuestionario
class Resultado(ResultadoBase):
    id_resultado: int
    id_prueba: int
    id_micro: int

    class Config:
        from_attributes: True

# Se necesitan las FK para cuestionario y prueba
class ResultadoCreate(ResultadoBase):
    id_micro: int
    id_prueba: int
