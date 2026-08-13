import os
from fastapi import FastAPI
from src.core.config import settings
from src.api.routes import microorganismos, usuarios, publicaciones, comentarios, cuestionarios, resultado_cuest, pruebas, resultados, medios
import src.models  
from src.crud import usuario as usuario_crud
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request, Depends
from sqlalchemy.orm import Session
from src.api.deps import get_db
from starlette.middleware.sessions import SessionMiddleware

# Crea la instancia principal de la app 
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
app.mount("/static", StaticFiles(directory="src/static"), name="static")
templates = Jinja2Templates(directory="src/templates")
@app.get("/")
async def inicio(request: Request, db: Session = Depends(get_db)):
    usuario = None
    id_usuario = request.session.get("id_usuario")
    if id_usuario:
        usuario = usuario_crud.get_usuario_by_id(db, id_usuario)
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "usuario": usuario,
            "app_mode": False
        }
    )

# ruta para las demas paginas 
@app.get("/identificacion")
async def identificacion(request: Request):
    return templates.TemplateResponse(
        "identificacion.html",
        {
            "request": request,
            "app_mode": True
        }
    )
@app.get("/login")
def login(request: Request):
    return templates.TemplateResponse(
        "login.html",
        {"request": request}
    )
@app.get("/diccionario")
async def diccionario(request: Request):
    return templates.TemplateResponse(
        "diccionario.html",
        {"request": request}
    )

app.add_middleware(
    SessionMiddleware,
    secret_key = os.getenv("SECRET_KEY"),
    max_age = 60 * 60 * 24 * 30 
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
