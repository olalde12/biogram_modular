from datetime import date
from pydantic import BaseModel, EmailStr
from typing import Optional

# Se define la estructura minima de un usuario
class UsuarioBase(BaseModel):
    nombre: constr(max_lenght)
    apellido: str
    correo: EmailStr
    contraseña: str

# Se agrega el identificador y la fecha a los campos
class Usuario(UsuarioBase):
    id_usuario: int
    fecha_registro: date
    estado: bool

    class Config:
        from_attributes: True

# Para crear usuario se guardara el correo en minusculas siempre
class UsuarioCreate(UsuarioBase):
    def dict(self, *args, **kwargs):
        d = super().dict(*args, **kwargs)
        d["correo"] = d["correo"].lower()
        return d
    
# Para modificar usuario y todos los campos sean opcionales
class UsuarioUpdate(UsuarioBase):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    correo: Optional[EmailStr] = None
    contraseña: Optional[str] = None

    def dict(self, *args, **kwargs):
        d = super().dict(*args, **kwargs)
        d["correo"] = d["correo"].lower()
        return d
