import sys
import os
import traceback
import json
import logging

# Configura logging dettagliato
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Log iniziale
logger.info('=' * 50)
logger.info('Starting Vercel serverless function initialization')
logger.info(f'Python version: {sys.version}')
logger.info(f'Current directory: {os.getcwd()}')
logger.info(f'Python path: {sys.path}')

# Aggiungi la directory parent al path per importare i moduli
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
logger.info(f'Current dir: {current_dir}')
logger.info(f'Parent dir: {parent_dir}')

sys.path.insert(0, parent_dir)

# Cambia directory di lavoro alla parent per risolvere import relativi
os.chdir(parent_dir)
logger.info(f'Changed working directory to: {os.getcwd()}')

# Verifica variabili d'ambiente critiche
logger.info('Checking environment variables...')
env_vars = ['DATABASE_URL', 'CA_FILE', 'JWT_SECRET', 'STRIPE_SECRET_KEY']
for var in env_vars:
    value = os.getenv(var)
    if value:
        # Maschera valori sensibili
        if 'SECRET' in var or 'KEY' in var or 'PASSWORD' in var:
            logger.info(f'{var}: {"*" * 20} (set)')
        elif var == 'DATABASE_URL':
            # Mostra solo l'inizio della URL
            logger.info(f'{var}: {value[:30]}... (set)')
        elif var == 'CA_FILE':
            logger.info(f'{var}: {len(value)} chars (set)')
        else:
            logger.info(f'{var}: {value[:50]}... (set)')
    else:
        logger.warning(f'{var}: NOT SET')

try:
    logger.info('Importing main module...')
    from main import app
    logger.info('Main module imported successfully')
    
    logger.info('Importing Mangum...')
    from mangum import Mangum
    logger.info('Mangum imported successfully')
    
    logger.info('Wrapping FastAPI app with Mangum...')
    # Wrappa l'app FastAPI con Mangum per compatibilità Vercel/Lambda
    handler = Mangum(app, lifespan="off")
    logger.info('Handler created successfully')
    logger.info('=' * 50)
    
except Exception as e:
    # Se c'è un errore, crea un handler che mostra l'errore dettagliato
    error_msg = str(e)
    error_traceback = traceback.format_exc()
    
    # Log completo per Vercel
    logger.error('=' * 50)
    logger.error(f'ERROR importing app: {error_msg}')
    logger.error(f'Traceback:\n{error_traceback}')
    logger.error('=' * 50)
    
    # Stampa anche su stdout per essere sicuri che Vercel lo veda
    print('=' * 50)
    print(f'ERROR importing app: {error_msg}')
    print(f'Traceback:\n{error_traceback}')
    print('=' * 50)
    
    def error_handler(event, context):
        """Handler di errore che restituisce JSON valido"""
        error_response = {
            'error': 'Internal Server Error',
            'message': error_msg,
            'traceback': error_traceback
        }
        
        # Log anche nella risposta
        print(f'Error handler called: {json.dumps(error_response)}')
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(error_response)
        }
    handler = error_handler
