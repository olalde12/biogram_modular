from pydantic import BaseModel

# Se define la estructura minima de resultado_prueba_micro
class ResultadoBase(BaseModel):
    resultado: str

# Se agregan las llaves foraneas y el ID
class Resultado(ResultadoBase):
    id_resultado: int
    id_prueba: int
    id_micro: int

    class Config:
        from_attributes: True

# Se necesitan las FK para microorganismo y prueba
class ResultadoCreate(ResultadoBase):
    id_micro: int
    id_prueba: int
