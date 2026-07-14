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

# Se nececita el campo de usuario (FK)
class PublicacionCreate(PublicacionBase):
    id_usuario: int
