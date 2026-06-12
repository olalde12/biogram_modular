from pydantic import BaseModel
from typing import List

# Se define la estructura de una opcion 
class OpcionBase(BaseModel):
    nombre_resultado: str
    descripcion_resultado: str
    imagen_resultado: str

class Opcion(OpcionBase):
    id_opcion: int
    id_prueba: int

    class Config:
        from_attributes = True

class OpcionCreate(OpcionBase):
    pass

# Se define la estructura minima de una prueba bioquimica
class PruebaBase(BaseModel):
    nombre: str
    tipo_resultado: str
    fundamento: str
    tiempo_reaccion: str
    descripcion: str

# Se agregan los campos de opcion
class Prueba(PruebaBase):
    id_prueba: int
    opciones: List[Opcion] 

    class Config:
        from_attributes: True

# Se necesitan los campos de opcion
class PruebaCreate(PruebaBase):
    opciones: List[OpcionCreate]  
