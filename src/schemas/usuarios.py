from datetime import date
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from typing import Optional

# Se define la estructura minima de un usuario
class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    correo: EmailStr
    contraseña: str

    @field_validator("correo", mode="before")
    @classmethod
    def normalizar_correo(cls, value):
        return str(value).strip().lower()

# Se agrega el identificador y la fecha a los campos
class Usuario(BaseModel):
    id_usuario: int
    nombre: str
    apellido: str
    correo: EmailStr
    avatar: Optional[str] = None
    fecha_registro: date
    estado: bool

    model_config = ConfigDict(from_attributes=True)

# Para crear usuario se guardara el correo en minusculas siempre
class UsuarioCreate(UsuarioBase):
    pass
    
# Para modificar usuario y todos los campos sean opcionales
class UsuarioUpdate(UsuarioBase):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    correo: Optional[EmailStr] = None
    contraseña: Optional[str] = None

    @field_validator("correo", mode="before")
    @classmethod
    def normalizar_correo(cls, value):
        if value is None:
            return None
        return str(value).strip().lower()

# Para modificar el avatar de un usuario
class AvatarUpdate(BaseModel):
    avatar: str

# Se define la estructura minima para el inicio de sesion
class login(BaseModel):
    correo: EmailStr
    contraseña: str
    recordar: bool = False

    @field_validator("correo", mode="before")
    @classmethod
    def normalizar_correo(cls, value):
        return str(value).strip().lower()
