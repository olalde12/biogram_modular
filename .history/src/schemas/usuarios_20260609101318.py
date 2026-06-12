from pydantic import BaseModel

# Se define la estructura minima de un usuario
class UsuarioBase(BaseModel):
    nombre: str
    gram: str
    forma: str
    descripcion: str
    imagen: str
    tipo: str

# Se agrega el identificador a los campos
class Microorganismo(Base):
    id_microorganismo: int

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class MicroorganismoCreate(MicroorganismoBase):
    pass
