from typing import Generator
from src.db.session import SessionLocal

def get_db() -> Generator:
    # Inicia una sesion con la base de datos
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
