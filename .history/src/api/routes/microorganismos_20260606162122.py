from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import microorganismo as microorganismo_crud
from src.schemas import microorganismo as microorganismo_schema

router = APIRouter()

def get_microorganismo(db: Session):
    return db.query(Microorganismo).all()