"""Eliminar tablas de antibiograma

Revision ID: 9fcc765d2ba2
Revises: 79c33bce60f2
Create Date: 2026-06-10 09:41:48.867945

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9fcc765d2ba2'
down_revision: Union[str, Sequence[str], None] = '79c33bce60f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("antibiogramas_microorganismos")
    op.drop_table("antibiogramas")
    op.drop_table("tests_antibiograma")
    op.drop_table("cultivos")


def downgrade() -> None:
    """Downgrade schema."""
    pass
