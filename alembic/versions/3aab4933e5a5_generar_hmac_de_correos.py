"""Generar HMAC de correos

Revision ID: 3aab4933e5a5
Revises: ca1def19368b
Create Date: 2026-11-07 21:49:09.181989

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from src.seguridad.correo import (
    generar_hmac_correo,
    descifrar_correo
)


# revision identifiers
revision: str = '3aab4933e5a5'
down_revision: Union[str, Sequence[str], None] = 'ca1def19368b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    connection = op.get_bind()

    # Leer los correos sin modificar su contenido.
    filas = connection.execute(
        sa.text("SELECT id_usuario, correo FROM usuarios")
    ).mappings().all()

    huellas_vistas = {}

    for fila in filas:
        id_usuario = fila["id_usuario"]
        correo = fila["correo"]

        if not correo:
            raise RuntimeError(
                f"El usuario con ID {id_usuario} no tiene correo."
            )

        # Compatibilidad por si algún correo ya está cifrado.
        if correo.startswith("enc:v1:"):
            correo = descifrar_correo(correo)

        huella = generar_hmac_correo(correo)

        # Comprobar que no existan HMAC duplicados.
        if huella in huellas_vistas:
            raise RuntimeError(
                "Se detectaron correos duplicados entre los usuarios "
                f"con ID {huellas_vistas[huella]} y {id_usuario}."
            )

        huellas_vistas[huella] = id_usuario

        connection.execute(
            sa.text("""
                UPDATE usuarios
                SET correo_hmac = :huella
                WHERE id_usuario = :id_usuario
            """),
            {
                "huella": huella,
                "id_usuario": id_usuario
            }
        )

    # Sustituir el índice único anterior.
    op.drop_index(
        "ix_usuarios_correo",
        table_name="usuarios"
    )

    op.create_index(
        "ux_usuarios_correo_hmac",
        "usuarios",
        ["correo_hmac"],
        unique=True
    )

    # Hacer obligatorios ambos campos.
    op.alter_column(
        "usuarios",
        "correo_hmac",
        existing_type=sa.String(length=64),
        nullable=False
    )

    op.alter_column(
        "usuarios",
        "correo",
        existing_type=sa.String(),
        nullable=False
    )



def downgrade() -> None:
    connection = op.get_bind()

    # Recuperar los correos en texto normal.
    filas = connection.execute(
        sa.text("SELECT id_usuario, correo FROM usuarios")
    ).mappings().all()

    for fila in filas:
        correo = fila["correo"]

        if correo.startswith("enc:v1:"):
            correo = descifrar_correo(correo)

        connection.execute(
            sa.text("""
                UPDATE usuarios
                SET correo = :correo
                WHERE id_usuario = :id_usuario
            """),
            {
                "correo": correo,
                "id_usuario": fila["id_usuario"]
            }
        )

    op.drop_index(
        "ux_usuarios_correo_hmac",
        table_name="usuarios"
    )

    op.alter_column(
        "usuarios",
        "correo_hmac",
        existing_type=sa.String(length=64),
        nullable=True
    )

    op.create_index(
        "ix_usuarios_correo",
        "usuarios",
        ["correo"],
        unique=True
    )
