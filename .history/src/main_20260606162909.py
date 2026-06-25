from fastapi import FastAPI
from src.core.config import settings
from src.api.routes import microorganismos

# Crea la intsnacia principal de la app 
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.include_router(microorganismos.router, prefix='/microorganismos', microorganismos)
