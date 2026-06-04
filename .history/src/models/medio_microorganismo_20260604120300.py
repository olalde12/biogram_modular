from sqlalchemy import Column, BigInteger, String, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Medio_microorganismo(Base):
    id_medio_micro = Column(BigInteger, primary_key=True, index=True)
