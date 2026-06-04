from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Medio_microorganismo(Base):
    id_medio_micro = Column(Integer, primary_key=True, index=True)
    id_micro = Column(Integer, ForeignKey("microorganismo.id_microorganismo"))
    id_medio = Column(Integer, ForeignKey("medios_cultivo.id_medio"))

    micro = relationship("Microorganismo")
    medio = relationship("Medios_cultivo", back_populates="res_prueba_micro")
