import sys
import os
import traceback
import json

# Handler minimale che funziona sempre
def create_handler():
    """Crea l'handler con gestione errori completa"""
    init_info = {
        'python_version': sys.version,
        'current_dir': os.getcwd(),
        'python_path': sys.path[:3],  # Solo primi 3 per non essere troppo lungo
        'env_vars': {}
    }
    
    # Verifica variabili d'ambiente
    env_vars_to_check = ['DATABASE_URL', 'CA_FILE', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'VERCEL_ENV']
    for var in env_vars_to_check:
        value = os.getenv(var)
        if value:
            if 'SECRET' in var or 'KEY' in var or 'PASSWORD' in var:
                init_info['env_vars'][var] = '***SET***'
            elif var == 'DATABASE_URL':
                init_info['env_vars'][var] = value[:50] + '...' if len(value) > 50 else value
            elif var == 'CA_FILE':
                init_info['env_vars'][var] = f'{len(value)} chars'
            else:
                init_info['env_vars'][var] = value
        else:
            init_info['env_vars'][var] = 'NOT SET'
    
    try:
        # Aggiungi la directory parent al path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        sys.path.insert(0, parent_dir)
        os.chdir(parent_dir)
        
        init_info['current_dir_after'] = os.getcwd()
        init_info['parent_dir'] = parent_dir
        
        # Prova a importare
        from main import app
        from mangum import Mangum
        
        base_handler = Mangum(app, lifespan="off")
        
        def wrapped_handler(event, context):
            try:
                return base_handler(event, context)
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    'body': json.dumps({
                        'error': 'Runtime Error',
                        'message': str(e),
                        'traceback': traceback.format_exc(),
                        'init_info': init_info
                    })
                }
        
        return wrapped_handler, None
        
    except Exception as e:
        error_msg = str(e)
        error_traceback = traceback.format_exc()
        
        def error_handler(event, context):
            """Handler di errore che mostra tutto nella risposta"""
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'error': 'Import Error',
                    'message': error_msg,
                    'traceback': error_traceback,
                    'init_info': init_info,
                    'debug': {
                        'file_location': __file__,
                        'current_dir': os.getcwd(),
                        'files_in_dir': os.listdir('.') if os.path.exists('.') else 'N/A',
                        'parent_files': os.listdir('..') if os.path.exists('..') else 'N/A'
                    }
                }, indent=2)
            }
        
        return error_handler, error_msg

# Crea l'handler
handler, init_error = create_handler()

# Se c'è un errore di inizializzazione, stampalo
if init_error:
    print(f'INIT ERROR: {init_error}')
    print(f'Traceback: {traceback.format_exc()}')
