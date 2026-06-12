from typing import Generator
from src.db.session import SessionLocal

def get_db() -> Generator:
    # Inicia un
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()