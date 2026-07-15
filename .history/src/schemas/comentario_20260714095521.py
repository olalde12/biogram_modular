from datetime import date
from pydantic import BaseModel

# Se define la estructura minima de un comentario
class ComentarioBase(BaseModel):
    contenido: str

# Se agrega el identificador y la fecha a los campos
class Comentario(ComentarioBase):
    id_comentario: int
    fecha_creacion: date
    id_publicacion: int
    id_usuario: int

    class Config:
        from_attributes: True

# Se necesita el campo de usuario y de publicacion (FK)
class ComentarioCreate(ComentarioBase):
    id_publicacion: int
    id_usuario: int

class ComentarioUpdate()
