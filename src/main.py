from fastapi import FastAPI
from src.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import microorganismos, usuarios, publicaciones, comentarios, cuestionarios, resultado_cuest, pruebas, resultados, medios
import src.models  
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi.responses import HTMLResponse

# Crea la intsnacia principal de la app 
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
app.mount("/static", StaticFiles(directory="src/static"), name="static")
templates = Jinja2Templates(directory="src/templates")
@app.get("/", response_class=HTMLResponse)
async def inicio(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

# ruta para las demas paginas 
@app.get("/identificacion", name="identificacion")
async def identificacion(request: Request):
    return templates.TemplateResponse(
        "identificacion.html",
        {"request": request}
    )

# Rutas del Swagger del FastAPI para hacer peticiones a la base de datos
app.include_router(usuarios.router, prefix='/usuarios', tags=['Etiquetas (usuarios)'])
app.include_router(publicaciones.router, prefix='/publicaciones', tags=['Etiquetas (publicaciones)'])
app.include_router(comentarios.router, prefix='/comentarios', tags=['Etiquetas (comentarios)'])
app.include_router(cuestionarios.router, prefix='/cuestionarios', tags=['Etiquetas (cuestionarios)'])
app.include_router(resultado_cuest.router, prefix='/resultados_cuestionarios', tags=['Etiquetas (resultados_cuestionarios)'])
app.include_router(pruebas.router, prefix='/pruebas', tags=['Etiquetas (pruebas)'])
app.include_router(resultados.router, prefix='/resultados', tags=['Etiquetas (resultados)'])
app.include_router(microorganismos.router, prefix='/microorganismos', tags=['Etiquetas (microorganismos)'])
app.include_router(medios.router, prefix='/medios', tags=['Etiquetas (medios)'])
