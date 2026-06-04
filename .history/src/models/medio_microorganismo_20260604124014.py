from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Medio_microorganismo(Base):
    id_medio_micro = Column(Integer, primary_key=True, index=True)

    id_micro = Column(Integer, ForeignKey("microorganismo.id_microorganismo"))
    id_medio = Column(Integer, ForeignKey("medios_culti"))

    micro = relationship("Microorganismo", back_populates="res_prueba_micro")
    prueba = relationship("Pruebas_bioquimicas", back_populates="res_prueba_micro")
