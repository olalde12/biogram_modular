from pydantic import BaseModel

# Se define la estructura minima de resultado_prueba_micro
class ResultadoBase(BaseModel):
    id_prueba: int
    id_micro: int
    id_opcion: int

# Se necesitan las FK para microorganismo y prueba
class ResultadoCreate(ResultadoBase):
    pass

# Se necesita el id 
class Resultado(ResultadoBase):
    id_resultado: int

    class Config:
        from_attributes = True
