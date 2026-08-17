from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.crud import pruebas, microorganismo, medios

router = APIRouter()

# Ruta para obtener un resultado segun la busqueda del usuario
@router.get('/{resp_usuario}')
def buscar(resp_usuario: str, db: Session = Depends(get_db)):
    return {
        "pruebas": pruebas.buscar_pruebas(resp_usuario, db),
        "microorganismos": microorganismo.buscar_microorganismo(resp_usuario, db),
        "medios": medios.buscar_medio(resp_usuario, db)
    }
