from fastapi import FastAPI
from src.core.config import settings
from src.api.routes import microorganismos, usuarios, cuestionarios, resultado_cuest, pruebas
import src.models  

# Crea la intsnacia principal de la app 
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.include_router(usuarios.router, prefix='/usuarios', tags=['Etiquetas (usuarios)'])
app.include_router(cuestionarios.router, prefix='/cuestionarios', tags=['Etiquetas (cuestionarios)'])
app.include_router(resultado_cuest.router, prefix='/resultados_cuestionarios', tags=['Etiquetas (resultados_cuestionarios)'])
app.include_router(pruebas.router, prefix='/pruebas', tags=['Etiquetas (pruebas)'])
app.include_router(microorganismos.router, prefix='/microorganismos', tags=['Etiquetas (microorganismos)'])