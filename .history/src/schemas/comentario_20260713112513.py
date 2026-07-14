from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de un comentario
class ComentarioBase(BaseModel):
    contenido: str

# Se agrega el identificador y la fecha a los campos
class Comentario(ComentarioBase):
    id_publicacion: int
    fecha_creacion: date
    id_usuario: int

    class Config:
        from_attributes: True

# Se nececita el campo de usuario (FK)
class PublicacionCreate(PublicacionBase):
    id_usuario: int
