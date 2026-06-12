from fastapi import FastAPI
from src.core.config import settings
from src.db import base

# Crea la intsnacia principal de la app 
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)