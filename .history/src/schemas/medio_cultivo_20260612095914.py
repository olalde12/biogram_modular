from pydantic import BaseModel

# Se define la estructura minima de un medio
class MedioBase(BaseModel):
    nombre: str
    procedimiento: str
    imagen: str
    tipo_muestra: str
    descripcion: str

# Se agrega el identificador a los campos
class Medio(MedioBase):
    id_medio: int

    class Config:
        from_attributes: True

# No se necesita ningun campo adicional 
class MedioCreate(MedioBase):
    pass
