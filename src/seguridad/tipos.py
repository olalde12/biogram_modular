
from sqlalchemy.types import TypeDecorator, String

from src.seguridad.correo import (
    cifrar_correo,
    descifrar_correo
)


class CorreoCifrado(TypeDecorator):
    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None

        return cifrar_correo(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None

        # Los correos antiguos permanecen en texto normal.
        if not value.startswith("enc:v1:"):
            return value

        return descifrar_correo(value)
