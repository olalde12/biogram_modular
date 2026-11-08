import os
import base64
import hashlib
import hmac
import secrets

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from dotenv import load_dotenv

load_dotenv()

# Obtener claves desde variables de entorno
def obtener_clave_aes():
    clave = os.getenv("EMAIL_ENCRYPTION_KEY")

    if not clave:
        raise RuntimeError("Falta EMAIL_ENCRYPTION_KEY")

    try:
        clave = base64.urlsafe_b64decode(clave)
    except Exception:
        raise RuntimeError("La clave AES no tiene un formato válido")

    if len(clave) != 32:
        raise RuntimeError("La clave AES debe tener exactamente 32 bytes")

    return clave


def obtener_clave_hmac():
    clave = os.getenv("EMAIL_HMAC_KEY")

    if not clave:
        raise RuntimeError("Falta EMAIL_HMAC_KEY")

    return clave.encode("utf-8")


# Normalizar correo
def normalizar_correo(correo: str) -> str:
    return correo.strip().lower()


# Cifrar correo mediante AES-256-GCM
def cifrar_correo(correo: str) -> str:
    clave = obtener_clave_aes()

    nonce = secrets.token_bytes(12)
    aes = AESGCM(clave)

    correo_normalizado = normalizar_correo(correo)

    cifrado = aes.encrypt(
        nonce,
        correo_normalizado.encode("utf-8"),
        b"biogram:usuarios:correo:v1"
    )

    datos = nonce + cifrado

    return "enc:v1:" + base64.urlsafe_b64encode(
        datos
    ).decode("utf-8")


# Descifrar correo
def descifrar_correo(correo_cifrado: str) -> str:
    clave = obtener_clave_aes()

    try:
        if not correo_cifrado.startswith("enc:v1:"):
            raise ValueError("El correo no tiene un formato cifrado válido")
        correo_cifrado = correo_cifrado[len("enc:v1:"):]
        datos = base64.urlsafe_b64decode(correo_cifrado)

        nonce = datos[:12]
        cifrado = datos[12:]

        aes = AESGCM(clave)

        correo = aes.decrypt(
            nonce,
            cifrado,
            b"biogram:usuarios:correo:v1"
        )

        return correo.decode("utf-8")

    except Exception:
        raise ValueError("No fue posible descifrar el correo electrónico")


# Generar huella HMAC para búsquedas
def generar_hmac_correo(correo: str) -> str:
    clave = obtener_clave_hmac()

    correo_normalizado = normalizar_correo(correo)

    huella = hmac.new(
        clave,
        correo_normalizado.encode("utf-8"),
        hashlib.sha256
    )

    return huella.hexdigest()
