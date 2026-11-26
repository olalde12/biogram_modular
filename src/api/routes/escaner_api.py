"""BIOGRAM IA - API provisional en memoria para FastAPI.

Compatible con el conector Biogram Raspberry v2.2:
 GET  /dispositivos/{device_id}/trabajos/pendiente
 POST /trabajos/{trabajo_id}/resultado

IMPORTANTE: uso LOCAL de desarrollo; no desplegar como servicio publico sin
control de CSRF, sesiones, HTTPS, autenticar device y limites operativos completos.
Sin SQLite ni accesos a BD: todos los datos se pierden al reiniciar FastAPI.
Ejecutar con un solo worker (sin --reload para la prueba inicial).
"""
from __future__ import annotations

import json
import os
import secrets
import threading
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel, Field

router = APIRouter()
DEVICE_ID = os.getenv("BIOGRAM_DEVICE_ID", "raspberry-biogram-01")
TOKEN = os.getenv("BIOGRAM_DEVICE_TOKEN", "")

PRUEBAS = {
    "SIN_ASIGNAR", "KIA", "glucosa_GLU", "sacarosa_SAC", "lactosa_LAC",
    "descarboxilacion_lisina_Dc", "desaminacion_lisina_Da", "ureasa_URE",
    "citrato_CIT", "movilidad_MOV", "indol_INO", "H2S", "gas_GAS",
    "descarboxilacion_ornitina_Dc",
}
# Volatil y compartido solamente entre solicitudes del mismo proceso.
_LOCK = threading.RLock()
_SESIONES: dict[str, dict] = {}
_TRABAJOS: dict[str, dict] = {}
_MAX_SESIONES = 40
_MAX_TRABAJOS = 120


def ahora() -> str:
    return datetime.now(timezone.utc).isoformat()


def usuario_actual(request: Request) -> str:
    # Reusa la autenticacion de la pagina. No consulta bases de datos.
    try:
        uid = request.session.get("id_usuario")
    except AssertionError:
        raise HTTPException(500, "Middleware de sesiones no configurado")
    if uid is None:
        raise HTTPException(401, "Inicia sesion para usar el escaner")
    return str(uid)


def origen_permitido(request: Request) -> None:
    """Defensa minima para peticiones desde navegador durante pruebas locales.

    Esta comprobacion NO sustituye una proteccion CSRF completa al publicar.
    """
    origen = request.headers.get("origin")
    if origen:
        from urllib.parse import urlsplit
        destino = urlsplit(origen)
        if destino.netloc != request.url.netloc:
            raise HTTPException(403, "Origen no permitido")


def autorizar_dispositivo(request: Request) -> None:
    if not TOKEN:
        raise HTTPException(503, "Configura BIOGRAM_DEVICE_TOKEN en el servidor")
    recibido = request.headers.get("authorization", "")
    if not recibido.startswith("Bearer ") or not secrets.compare_digest(recibido[7:], TOKEN):
        raise HTTPException(401, "Dispositivo no autorizado")


def sesion_propia(id_sesion: str, usuario: str) -> dict:
    sesion = _SESIONES.get(id_sesion)
    if sesion is None or sesion["usuario_id"] != usuario:
        raise HTTPException(404, "Sesion no encontrada")
    return sesion


def encolar(id_sesion: str, accion: str, parametros: dict) -> str:
    if any(t["estado"] == "PENDIENTE" for t in _TRABAJOS.values()):
        raise HTTPException(409, "Escaner ocupado: ya existe un trabajo pendiente")
    if len(_TRABAJOS) >= _MAX_TRABAJOS:
        raise HTTPException(503, "Capacidad de demostracion agotada; reinicia el servidor de prueba")
    tid = uuid.uuid4().hex
    _TRABAJOS[tid] = {
        "id": tid, "sesion_id": id_sesion, "dispositivo_id": DEVICE_ID,
        "accion": accion, "estado": "PENDIENTE", "parametros": parametros,
        "resultado": None, "fecha": ahora(),
    }
    _SESIONES[id_sesion]["trabajos"].append(tid)
    return tid


class Captura(BaseModel):
    prueba_referencia: str = "SIN_ASIGNAR"
    roi: tuple[float, float, float, float] = (0.35, 0.2, 0.65, 0.8)


class Finalizar(BaseModel):
    # Datos de pruebas manualmente confirmadas, no inferidos de un color aislado.
    observaciones: dict[str, str] = Field(default_factory=dict, max_length=13)


class ResultadoDispositivo(BaseModel):
    id_trabajo: str
    sesion_id: str
    dispositivo_id: str
    fecha_utc: str
    resultado: dict


@router.get("/estado")
def estado():
    return {
        "api": "biogram-v1", "estado": "LISTA_PARA_PRUEBAS",
        "dispositivo_configurado": bool(TOKEN), "almacenamiento": "MEMORIA_TEMPORAL"
    }


@router.post("/sesiones", status_code=201)
def crear_sesion(request: Request):
    origen_permitido(request)
    usuario = usuario_actual(request)
    with _LOCK:
        if len(_SESIONES) >= _MAX_SESIONES:
            raise HTTPException(503, "Limite de sesiones de demostracion")
        sid = uuid.uuid4().hex
        _SESIONES[sid] = {
            "usuario_id": usuario, "dispositivo_id": DEVICE_ID,
            "estado": "EN_PROCESO", "fecha": ahora(), "trabajos": []
        }
    return {"sesion_id": sid, "estado": "EN_PROCESO", "dispositivo_id": DEVICE_ID}


@router.post("/sesiones/{sesion_id}/capturar", status_code=202)
def solicitar_captura(sesion_id: str, datos: Captura, request: Request):
    origen_permitido(request)
    usuario = usuario_actual(request)
    x1, y1, x2, y2 = datos.roi
    if datos.prueba_referencia not in PRUEBAS:
        raise HTTPException(422, "Prueba de referencia no admitida")
    if not (0 <= x1 < x2 <= 1 and 0 <= y1 < y2 <= 1
            and x2-x1 >= 0.01 and y2-y1 >= 0.01):
        raise HTTPException(422, "Zona de captura invalida")
    with _LOCK:
        sesion = sesion_propia(sesion_id, usuario)
        if sesion["estado"] != "EN_PROCESO":
            raise HTTPException(409, "Sesion cerrada")
        tid = encolar(sesion_id, "CAPTURAR", {
            "prueba_referencia": datos.prueba_referencia, "roi": list(datos.roi)
        })
    return {"trabajo_id": tid, "estado": "PENDIENTE"}


@router.post("/sesiones/{sesion_id}/terminar", status_code=202)
def terminar(sesion_id: str, datos: Finalizar, request: Request):
    origen_permitido(request)
    usuario = usuario_actual(request)
    if not set(datos.observaciones).issubset(PRUEBAS - {"SIN_ASIGNAR"}):
        raise HTTPException(422, "Prueba no admitida")
    with _LOCK:
        sesion = sesion_propia(sesion_id, usuario)
        if sesion["estado"] != "EN_PROCESO":
            raise HTTPException(409, "Sesion cerrada")
        tid = encolar(sesion_id, "TERMINAR", {"observaciones": datos.observaciones})
        sesion["estado"] = "TERMINANDO"
    return {"trabajo_id": tid, "estado": "PENDIENTE"}


@router.get("/sesiones/{sesion_id}")
def consultar_sesion(sesion_id: str, request: Request):
    usuario = usuario_actual(request)
    with _LOCK:
        sesion = sesion_propia(sesion_id, usuario)
        return {
            "sesion_id": sesion_id, "estado": sesion["estado"],
            "trabajos": [
                {"id": tid, "accion": _TRABAJOS[tid]["accion"],
                 "estado": _TRABAJOS[tid]["estado"],
                 "resultado": _TRABAJOS[tid]["resultado"]}
                for tid in sesion["trabajos"]
            ],
        }


@router.get("/dispositivos/{device_id}/trabajos/pendiente")
def obtener_trabajo(device_id: str, request: Request):
    autorizar_dispositivo(request)
    if device_id != DEVICE_ID:
        raise HTTPException(404, "Dispositivo desconocido")
    with _LOCK:
        t = next((t for t in _TRABAJOS.values() if t["estado"] == "PENDIENTE"), None)
        if t is None:
            return {"trabajo": None}
        return {"trabajo": {
            "id": t["id"], "sesion_id": t["sesion_id"],
            "accion": t["accion"], **t["parametros"]
        }}


@router.post("/trabajos/{trabajo_id}/resultado")
def registrar_resultado(trabajo_id: str, datos: ResultadoDispositivo, request: Request,
                       idempotency_key: str | None = Header(None, alias="Idempotency-Key")):
    autorizar_dispositivo(request)
    if (idempotency_key != trabajo_id or datos.id_trabajo != trabajo_id
            or datos.dispositivo_id != DEVICE_ID):
        raise HTTPException(400, "Identificacion de trabajo invalida")
    if len(json.dumps(datos.resultado, ensure_ascii=False).encode("utf-8")) > 700_000:
        raise HTTPException(413, "Resultado demasiado grande")
    with _LOCK:
        t = _TRABAJOS.get(trabajo_id)
        if t is None or t["sesion_id"] != datos.sesion_id:
            raise HTTPException(404, "Trabajo no encontrado")
        if t["estado"] == "COMPLETADO":
            return {"aceptado": True, "duplicado": True}
        t["resultado"] = datos.resultado
        t["estado"] = "COMPLETADO"
        if t["accion"] == "TERMINAR":
            _SESIONES[t["sesion_id"]]["estado"] = "FINALIZADA"
    return {"aceptado": True}
