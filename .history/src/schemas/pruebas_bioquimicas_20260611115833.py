from pydantic import BaseModel
from typing import List

# Se define la estructura de una opcion 
class OpcionBase(BaseModel):
    valor: str
    descripcion: str

class OpcionCreate(OpcionBase):
    pass

class Opcion(OpcionBase):
    id_opcion: int
    id_prueba: int

    class Config:
        from_attributes = True

# Se define la estructura minima de una prueba bioquimica
class PruebaBase(BaseModel):
    nombre: str
    tipo_resultado: str
    fundamento: str
    tiempo_reaccion: str
    descripcion: str

# Se agregan algunos datos para el cuestionario
class Prueba(PruebaBase):
    opciones: List[OpcionCreate]

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class PruebaCreate(PruebaBase):
    opciones: List[OpcionCreate]  

class Prueba(PruebaBase):
    id_prueba: int
    opciones: List[Opcion]        # <-- respuesta incluye opciones

    class Config:
        from_attributes = True
