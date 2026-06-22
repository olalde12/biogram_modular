from pydantic import BaseModel
from typing import List

# Se define la estructura de la tabla intermedia
class Medio_microBase(BaseModel):
    id_micro: int
    id_medio: int

class Medio_micro(Medio_microBase):
    id_medio_micro: int
    id_prueba: int

    class Config:
        from_attributes = True

class OpcionCreate(OpcionBase):
    pass

# Se define la estructura minima de un medio
class MedioBase(BaseModel):
    nombre: str
    procedimiento: str
    imagen: str
    tipo_muestra: str
    descripcion: str

# Se agrega el identificador a los campos
class Medio(MedioBase):
    id_medio: int
    resultado: List[medio_micro] 

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class MedioCreate(MedioBase):
    resultado: List[medio_microCreate] 
