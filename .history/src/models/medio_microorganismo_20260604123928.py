from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base_class import Base

class Medio_microorganismo(Base):
    id_medio_micro = Column(Integer, primary_key=True, index=True)
