import os
import re
import unicodedata
from openai import OpenAI
from fastapi import HTTPException
from src.core.config import settings

# Obtener clave para tener conexion con OPEN AI
cliente = OpenAI(api_key=settings.OPENAI_API_KEY)

# Palbras que no pueden usarse porque son consideradas insultos
PALABRAS_PROHIBIDAS = {"pendejo", "pendeja", "puto", "puta", "mierda", "verga", "cabron", "cabrona", "imbecil","estupido","estupida","htpm","putisima","idiota","zorra","tarado","tarada","hdp","pito","pucha","puchaina","coño", "alv","putazo","putaso"}

def normalizar(texto: str) -> str:
    # Hacer que el texto sea en minusculas
    texto = texto.lower()

    # Normalizar acentos
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")

    # Eliminar simbolos y espacios.
    return re.sub(r"[^a-z0-9]", "", texto)


def contiene_malas_palabras(texto: str) -> bool:
    texto_normalizado = normalizar(texto)

    # Sustituciones que se pueden tener con numeros
    texto_normalizado = texto_normalizado.translate(
        str.maketrans({
            "0": "o",
            "1": "i",
            "3": "e",
            "4": "a",
            "5": "s",
            "7": "t",
            "8": "b",
        })
    )

    return any(
        palabra in texto_normalizado
        for palabra in PALABRAS_PROHIBIDAS
    )


def contenido_moderado(texto: str) -> bool:
    # Primero comprobar la lista local
    if contiene_malas_palabras(texto):
        return True

    # Despues consultmaos a open ai 
    try:
        respuesta = cliente.moderations.create(model="omni-moderation-latest", input=texto)
        return respuesta.results[0].flagged
    except Exception:
        # No permitir publicar si falla la verificacion
        raise HTTPException(
            status_code=503,
            detail=("No se pudo verificar el contenido. Intenta nuevamente más tarde.")
        )
