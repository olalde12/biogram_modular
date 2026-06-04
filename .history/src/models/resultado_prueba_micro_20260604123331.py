from sqlalchemy import Column, BigInteger, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Resultado_prueba_micro(Base):
    id_resultado = Column(BigInteger, primary_key=True, index=True)
    resultado = Column(String)

        prueba = relationship("Pruebas_bioquimicas", back_populates="opc_prueba")