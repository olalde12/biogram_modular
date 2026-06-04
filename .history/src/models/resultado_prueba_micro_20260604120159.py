from sqlalchemy import Column, BigInteger, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Resultado_prueba_micro(Base):
    id_resultado = Column(BigInteger, primary_key=True, index=True)
    resultado = Column(String)
    apellido = Column(String)
    correo = Column(String, unique=True, index=True)
    contraseña = Column(String)
    fecha_registro = Column(Date, server_default=func.now())
    estado = Column(Boolean, default=True)