from pydantic import BaseModel

# Se define la estructura minima de un microorganismo
class MicroorganismoBase(BaseModel):
    nombre: str
    gram: str
    forma: str
    descripcion: str
    imagen: str
    tipo: str

# Se agrega el 
class Microorganismo(MicroorganismoBase):
    id: int

    class Config:
        from_attributes: True

class MicroorganismoCreate(BaseModel):
    pass