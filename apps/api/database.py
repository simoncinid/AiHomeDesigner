from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import tempfile

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

database_url = os.getenv('DATABASE_URL', 'postgresql://localhost/aihomedesigner')

# Usa connect_args per evitare errori di connessione all'avvio su serverless
# e configura SSL se necessario
engine = create_engine(
    database_url, 
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args=_get_ssl_config()
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
