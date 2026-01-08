from logging.config import fileConfig
from sqlalchemy import engine_from_config, create_engine
from sqlalchemy import pool
from alembic import context
import os
import sys
import tempfile

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import Base
from models import *  # noqa

config = context.config
fileConfig(config.config_file_name)

def _get_ssl_config():
    """Configura SSL per la connessione PostgreSQL con CA certificate"""
    connect_args = {"connect_timeout": 10}
    
    ca_file_content = os.getenv('CA_FILE')
    if ca_file_content:
        # Rimuovi il prefisso @ se presente
        if ca_file_content.startswith('@'):
            ca_file_content = ca_file_content[1:]
        
        # Crea un file temporaneo per il CA certificate
        # Usa /tmp che è scrivibile su Render
        ca_file_path = os.path.join(tempfile.gettempdir(), 'ca_certificate.crt')
        with open(ca_file_path, 'w') as f:
            f.write(ca_file_content)
        
        # Configura SSL per psycopg2
        connect_args['sslmode'] = 'require'
        connect_args['sslrootcert'] = ca_file_path
    
    return connect_args

# Override sqlalchemy.url from environment
database_url = os.getenv('DATABASE_URL')
if database_url:
    config.set_main_option('sqlalchemy.url', database_url)

target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    # Usa create_engine direttamente per poter passare connect_args con SSL
    database_url = os.getenv('DATABASE_URL') or config.get_main_option("sqlalchemy.url")
    if database_url:
        connectable = create_engine(
            database_url,
            poolclass=pool.NullPool,
            connect_args=_get_ssl_config()
        )
    else:
        connectable = engine_from_config(
            config.get_section(config.config_ini_section, {}),
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
        )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
