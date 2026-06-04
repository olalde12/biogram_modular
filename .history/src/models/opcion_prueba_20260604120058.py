from sqlalchemy import Column, BigInteger, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Opcion_prueba(Base):
    id_opcion_prueba = Column(BigInteger, primary_key=True, index=True)
    nombre_resultado = Column(String)
    descripcion_resultado = Column(String)
    imagen_resultado = Column(String)
    contraseña = Column(String)
    fecha_registro = Column(Date, server_default=func.now())
    estado = Column(Boolean, default=True)