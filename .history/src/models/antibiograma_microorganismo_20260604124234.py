from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base_class import Base

class Antibiograma_microorganismo(Base):
    id_anti_micro = Column(Integer, primary_key=True, index=True)
    resultado = Column(String)
    id_micro = Column(Integer, ForeignKey("microorganismo.id_microorganismo"))
    id_antibiograma = Column(Integer, ForeignKey("pruebas_bioquimicas.id_prueba"))

    micro = relationship("Microorganismo", back_populates="res_prueba_micro")
    antibiograma = relationship("Pruebas_bioquimicas", back_populates="res_prueba_micro")