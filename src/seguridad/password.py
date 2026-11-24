import hmac

from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


# Generar hash Argon2
def hash_password(password: str) -> str:
    return password_hash.hash(password)


# Verificar contraseña y migrar usuarios antiguos
def verificar_password_compatible(
    password: str,
    password_guardado: str
):

    # Usuario que ya utiliza Argon2
    if password_guardado.startswith("$argon2"):

        try:
            valido = password_hash.verify(
                password,
                password_guardado
            )

            return valido, None

        except Exception:
            return False, None

    # Compatibilidad temporal con contraseñas antiguas
    valido = hmac.compare_digest(
        password.encode("utf-8"),
        password_guardado.encode("utf-8")
    )

    if valido:
        nuevo_hash = hash_password(password)
        return True, nuevo_hash

    return False, None
