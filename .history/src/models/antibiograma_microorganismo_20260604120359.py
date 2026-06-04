from sqlalchemy import Column, BigInteger, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Antibiograma_microorganismo(Base):
    id_anti_micro = Column(BigInteger, primary_key=True, index=True)
    resultado = Column(String)