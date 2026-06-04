from sqlalchemy import Column, BigInteger, String
from src.db.base_class import Base

class Pruebas_bioquimicas(Base):
    id_prueba = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    tipo_resultado = Column(String)
    fundamento = Column(String)
    tiempo_reaccion = Column(String)
    descripcion = Column(String)

    res_prueba = relationship("Resultado_cuestionario", back_populates="prueba")