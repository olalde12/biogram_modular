from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base_class import Base

# Definicion del modelo opcion_prueba
class Opcion_prueba(Base):
    __tablename__="opciones"
    id_opcion_prueba = Column(Integer, primary_key=True, index=True)
    nombre_resultado = Column(String)
    descripcion_resultado = Column(String)
    imagen_resultado = Column(String)
    id_prueba = Column(Integer, ForeignKey("pruebas_bioquimicas.id_prueba"))

    prueba = relationship("Pruebas_bioquimicas", back_populates="opc_prueba")
