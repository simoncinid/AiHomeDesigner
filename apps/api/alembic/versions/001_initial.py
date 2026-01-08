"""initial

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('stripe_customer_id', sa.String(), nullable=True),
        sa.Column('credits_photo', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('credits_video', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'])

    op.create_table(
        'ip_daily_usage',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('ip_hash', sa.String(), nullable=False),
        sa.Column('usage_date', sa.Date(), nullable=False),
        sa.Column('free_images_used', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_ip_daily_usage_ip_hash', 'ip_daily_usage', ['ip_hash'])
    op.create_unique_constraint('uq_ip_daily_usage_ip_hash_date', 'ip_daily_usage', ['ip_hash', 'usage_date'])

    op.create_table(
        'jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('share_id', sa.String(), nullable=False, unique=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('ip_hash', sa.String(), nullable=True),
        sa.Column('kind', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='created'),
        sa.Column('wavespeed_request_id', sa.String(), nullable=True),
        sa.Column('room_type', sa.String(), nullable=True),
        sa.Column('style_preset', sa.String(), nullable=True),
        sa.Column('prompt', sa.Text(), nullable=False),
        sa.Column('input_urls', postgresql.JSON, nullable=True),
        sa.Column('output_urls', postgresql.JSON, nullable=True),
        sa.Column('error', sa.Text(), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    )
    op.create_index('ix_jobs_share_id', 'jobs', ['share_id'])
    op.create_index('ix_jobs_user_id', 'jobs', ['ip_hash'])

    op.create_table(
        'credit_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('kind', sa.String(), nullable=False),
        sa.Column('photo_delta', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('video_delta', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('reason', sa.String(), nullable=False),
        sa.Column('stripe_event_id', sa.String(), nullable=True),
        sa.Column('job_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id']),
    )
    op.create_index('ix_credit_transactions_stripe_event_id', 'credit_transactions', ['stripe_event_id'])


def downgrade():
    op.drop_table('credit_transactions')
    op.drop_table('jobs')
    op.drop_table('ip_daily_usage')
    op.drop_table('users')
