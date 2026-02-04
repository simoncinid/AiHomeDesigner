"""add_free_generation_leads

Revision ID: 003
Revises: 002
Create Date: 2026-02-04 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'free_generation_leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('language', sa.String(), nullable=False),
        sa.Column('ip_hash', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_free_generation_leads_email', 'free_generation_leads', ['email'])
    op.create_index('ix_free_generation_leads_ip_hash', 'free_generation_leads', ['ip_hash'])


def downgrade():
    op.drop_index('ix_free_generation_leads_ip_hash', table_name='free_generation_leads')
    op.drop_index('ix_free_generation_leads_email', table_name='free_generation_leads')
    op.drop_table('free_generation_leads')

