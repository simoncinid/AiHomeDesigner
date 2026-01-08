import sys
import os
import traceback
import json

# Aggiungi la directory parent al path per importare i moduli
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Cambia directory di lavoro alla parent per risolvere import relativi
os.chdir(parent_dir)

try:
    from main import app
    from mangum import Mangum
    
    # Wrappa l'app FastAPI con Mangum per compatibilità Vercel/Lambda
    handler = Mangum(app, lifespan="off")
except Exception as e:
    # Se c'è un errore, crea un handler che mostra l'errore dettagliato
    error_msg = str(e)
    error_traceback = traceback.format_exc()
    
    # Log completo per Vercel
    print(f'Error importing app: {error_msg}')
    print(f'Traceback:\n{error_traceback}')
    
    def error_handler(event, context):
        """Handler di errore che restituisce JSON valido"""
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': error_msg,
                'traceback': error_traceback if os.getenv('VERCEL_ENV') != 'production' else None
            })
        }
    handler = error_handler
