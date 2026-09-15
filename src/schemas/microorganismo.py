from pydantic import BaseModel
from typing import List

# Se define la estructura minima de un microorganismo
class ResultadoBase(BaseModel):
    id_prueba: int
    id_micro: int
    id_opcion: int

class Resultado(ResultadoBase):
    id_resultado: int

    class Config:
        from_attributes = True

class ResultadoCreate(ResultadoBase):
    pass

# Se agrega el identificador a los campos
class MicroorganismoBase(BaseModel):
    nombre: str
    gram: str
    forma: str
    descripcion: str
    imagen: str
    tipo: str
    
class Microorganismo(MicroorganismoBase):
    id_microorganismo: int
    res_prueba_micro: List[Resultado] 

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class MicroorganismoCreate(MicroorganismoBase):
    res_prueba_micro: List[ResultadoCreate] 
