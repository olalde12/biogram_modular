from pydantic import BaseModel

#
class MicroorganismoBase(BaseModel):
    nombre: str
    gram: str
    forma: str
    descripcion: str
    

class Microorganismo(MicroorganismoBase):
    id: int

    class Config:
        from_attributes: True

class MicroorganismoCreate(BaseModel):
    pass