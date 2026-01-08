from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import tempfile
import atexit

Base = declarative_base()

# Variabili globali lazy-initialized
_engine = None
_SessionLocal = None
_ca_file_path = None

def _get_ssl_config():
    """Configura SSL per la connessione PostgreSQL con CA certificate"""
    connect_args = {"connect_timeout": 10}
    
    ca_file_content = os.getenv('CA_FILE')
    if ca_file_content:
        # Rimuovi il prefisso @ se presente
        if ca_file_content.startswith('@'):
            ca_file_content = ca_file_content[1:]
        
        # Crea un file temporaneo per il CA certificate
        # Usa /tmp che è scrivibile su Render e Vercel
        global _ca_file_path
        _ca_file_path = os.path.join(tempfile.gettempdir(), f'ca_certificate_{os.getpid()}.crt')
        try:
            with open(_ca_file_path, 'w') as f:
                f.write(ca_file_content)
        except Exception as e:
            print(f'Warning: Could not write CA certificate file: {e}')
            return connect_args
        
        # Configura SSL per psycopg2
        connect_args['sslmode'] = 'require'
        connect_args['sslrootcert'] = _ca_file_path
    
    return connect_args

def _get_engine():
    """Lazy initialization dell'engine per evitare errori all'avvio su serverless"""
    global _engine, _SessionLocal
    
    if _engine is None:
        database_url = os.getenv('DATABASE_URL', 'postgresql://localhost/aihomedesigner')
        
        if not database_url or database_url == 'postgresql://localhost/aihomedesigner':
            raise ValueError('DATABASE_URL environment variable is not set')
        
        try:
            _engine = create_engine(
                database_url, 
                pool_pre_ping=True,
                pool_recycle=300,
                pool_size=1,  # Ridotto per serverless
                max_overflow=0,  # Nessun overflow per serverless
                connect_args=_get_ssl_config()
            )
            _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
        except Exception as e:
            print(f'Error creating database engine: {e}')
            raise
    
    return _engine

def get_db():
    """Dependency per ottenere una sessione database"""
    engine = _get_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Cleanup del file CA certificate all'uscita
def _cleanup_ca_file():
    global _ca_file_path
    if _ca_file_path and os.path.exists(_ca_file_path):
        try:
            os.remove(_ca_file_path)
        except:
            pass

atexit.register(_cleanup_ca_file)
