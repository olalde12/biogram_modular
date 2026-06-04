from sqlalchemy import Column, BigInteger, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Resultado_cuestionario(Base):
    id_resultado_cues = Column(BigInteger, primary_key=True, index=True)
    nombre = Column(String, index=True)
    apellido = Column(String)