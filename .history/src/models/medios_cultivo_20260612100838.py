from sqlalchemy import Column, Integer, String
from src.db.base_class import Base

# Definicion del modelo medio_cultivo
class Medio_cultivo(Base):
    __tablename__="medios_cultivo"
    id_medio = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    procedimiento = Column(String)
    imagen = Column(String)
    tipo_muestra = Column(String)
    descripcion = Column(String)
    
    resultado = relationship("Medio_microorganismo", back_populates)
