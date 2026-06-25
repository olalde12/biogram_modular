from fastapi import FastAPI
from src.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import microorganismos, usuarios, cuestionarios, resultado_cuest, pruebas, resultados, medios
import src.models  

# Crea la intsnacia principal de la app 
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router, prefix='/usuarios', tags=['Etiquetas (usuarios)'])
app.include_router(cuestionarios.router, prefix='/cuestionarios', tags=['Etiquetas (cuestionarios)'])
app.include_router(resultado_cuest.router, prefix='/resultados_cuestionarios', tags=['Etiquetas (resultados_cuestionarios)'])
app.include_router(pruebas.router, prefix='/pruebas', tags=['Etiquetas (pruebas)'])
app.include_router(resultados.router, prefix='/resultados', tags=['Etiquetas (resultados)'])
app.include_router(microorganismos.router, prefix='/microorganismos', tags=['Etiquetas (microorganismos)'])
app.include_router(medios.router, prefix='/medios', tags=['Etiquetas (medios)'])
