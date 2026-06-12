from pydantic import BaseModel

# Se define la estructura minima de opcion_prueba
class OpcionBase(BaseModel):
    nombre_resultado: str
    descripcion_resultado: str
    imagen_resultado: str

# Se agregan el ID para opcion_prueba
class Opcion(OpcionBase):
    id_opcion_prueba: int

    class Config:
        from_attributes: True

# Se necesita la FK para prueba
class OpcionCreate(OpcionBase):
    id_prueba: int
    id_opcion_prueba: int
