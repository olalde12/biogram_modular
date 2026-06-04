from sqlalchemy import Column, BigInteger, String
from src.db.base_class import Base

class Pruebas_bioquimicas(Base):
    id_prueba = Column(BigInteger, primary_key=True, index=True)
    nombre = Column(String, index=True)
    tipo_resultado = Column(String)
    fundamento = Column(String)
    tiempo_reaccion = Column(String)
    descripcion = Column(String)

    id_cuesti = Column(Integer, ForeignKey("cuestionario.id_cuestionario"))
    id_prueba = Column(Integer, ForeignKey("pruebas_bioquimicas.id_prueba"))

    cuestionario = relationship("Cuestionario", back_populates="res_cuestionario")
    prueba = relationship("Pruebas_bioquimicas", back_populates="res_prueba")