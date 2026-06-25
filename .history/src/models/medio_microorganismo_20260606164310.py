from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base_class import Base

# Definciion del modelo medio_microorganismo
class Medio_microorganismo(Base):
    __tablename__
    id_medio_micro = Column(Integer, primary_key=True, index=True)
    id_micro = Column(Integer, ForeignKey("microorganismo.id_microorganismo"))
    id_medio = Column(Integer, ForeignKey("medio_cultivo.id_medio"))

    micro = relationship("Microorganismo")
    medio = relationship("Medio_cultivo")
