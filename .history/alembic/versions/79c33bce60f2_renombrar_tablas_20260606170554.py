"""Renombrar tablas

Revision ID: 79c33bce60f2
Revises: 62da52a02a63
Create Date: 2026-06-06 16:52:01.599782

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '79c33bce60f2'
down_revision: Union[str, Sequence[str], None] = '62da52a02a63'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.rename_table("resultado_prueba_micro", "resultados_prueba_micro")
    op.rename_table("resultado_cuestionario", "resultados_cuestionario")
    op.rename_table("opcion_prueba", "opciones_prueba")
    op.rename_table("microorganismo", "microorganismos")
    op.rename_table("medio_cultivo", "medios_cultivo")

def downgrade():
    op.rename_table("bacterias", "microorganismos")
    op.rename_table("tests_antibiograma", "antibiogramas")
    op.rename_table("cultivos", "medios_cultivo")
