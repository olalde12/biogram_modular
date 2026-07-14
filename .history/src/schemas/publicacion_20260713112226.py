from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de una publicacion
class PublicacionBase(BaseModel):
    titulo: str
    contenido: str

# Se agrega el identificador y la fecha a los campos
class Publicacion(PublicacionBase):
    id_publicacion: int
    fecha_creacion: date

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class PublicacionCreate(PublicacionBase):
    id_
