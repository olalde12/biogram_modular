from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base_class import Base

# Definciion del modelo medio_microorganismo
class Medio_microorganismo(Base):
    __tablename__="medios_microorganismos"
    id_medio_micro = Column(Integer, primary_key=True, index=True)
    id_micro = Column(Integer, ForeignKey("microorganismos.id_microorganismo"))
    id_medio = Column(Integer, ForeignKey("medios_cultivo.id_medio"))

    micro = relationship("Microorganismo", back_populates="resultado")
    medio = relationship("Medio_cultivo", back)
