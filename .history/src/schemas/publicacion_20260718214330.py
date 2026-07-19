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
    id_usuario: int

    class Config:
        from_attributes: True

# Se necesita el campo de usuario (FK)
class PublicacionCreate(PublicacionBase):
    id_usuario: int

# Base para actualizar una publicacion
class PublicacionUpdate(PublicacionBase):
    titulo: Optional[str] = None
    contenido: str
