"""create timeseries and timeseries_data tables

Revision ID: 4f897bfce624
Revises: 
Create Date: 2026-03-03 21:03:56.893282

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '4f897bfce624'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('timeseries',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('extra_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('data_points_count', sa.Integer(), nullable=False),
    sa.Column('time_range_start', sa.DateTime(timezone=True), nullable=True),
    sa.Column('time_range_end', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_timeseries_id'), 'timeseries', ['id'], unique=False)
    op.create_index(op.f('ix_timeseries_name'), 'timeseries', ['name'], unique=False)
    op.create_table('timeseries_data',
    sa.Column('timeseries_id', sa.UUID(), nullable=False),
    sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
    sa.Column('value', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['timeseries_id'], ['timeseries.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('timeseries_id', 'timestamp')
    )
    op.create_index('ix_timeseries_data_timeseries_id_timestamp', 'timeseries_data', ['timeseries_id', 'timestamp'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_timeseries_data_timeseries_id_timestamp', table_name='timeseries_data')
    op.drop_table('timeseries_data')
    op.drop_index(op.f('ix_timeseries_name'), table_name='timeseries')
    op.drop_index(op.f('ix_timeseries_id'), table_name='timeseries')
    op.drop_table('timeseries')
