import sys
import os
import traceback
import json

# Handler che funziona SEMPRE, anche se tutto fallisce
def handler(event, context):
    """Handler che cattura TUTTI gli errori e li mostra nella risposta"""
    try:
        # Info di base
        debug_info = {
            'python_version': sys.version.split()[0],
            'current_dir': os.getcwd(),
            'file_location': __file__,
            'python_path': sys.path[:5],
        }
        
        # Verifica file e directory
        current_file = os.path.abspath(__file__)
        current_dir = os.path.dirname(current_file)
        parent_dir = os.path.dirname(current_dir)
        
        debug_info['current_file'] = current_file
        debug_info['current_dir'] = current_dir
        debug_info['parent_dir'] = parent_dir
        debug_info['file_exists'] = os.path.exists(current_file)
        debug_info['parent_exists'] = os.path.exists(parent_dir)
        
        # Lista file
        try:
            debug_info['files_in_current'] = os.listdir(current_dir) if os.path.exists(current_dir) else []
            debug_info['files_in_parent'] = os.listdir(parent_dir) if os.path.exists(parent_dir) else []
        except:
            debug_info['files_error'] = traceback.format_exc()
        
        # Verifica variabili d'ambiente
        env_vars = {}
        for var in ['DATABASE_URL', 'CA_FILE', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'VERCEL_ENV']:
            val = os.getenv(var)
            if val:
                if 'SECRET' in var or 'KEY' in var:
                    env_vars[var] = 'SET'
                elif var == 'DATABASE_URL':
                    env_vars[var] = val[:30] + '...'
                elif var == 'CA_FILE':
                    env_vars[var] = f'{len(val)} chars'
                else:
                    env_vars[var] = val
            else:
                env_vars[var] = 'NOT SET'
        debug_info['env_vars'] = env_vars
        
        # Prova a importare
        import_error = None
        try:
            # Aggiungi parent al path
            if parent_dir not in sys.path:
                sys.path.insert(0, parent_dir)
            os.chdir(parent_dir)
            
            # Prova import
            from main import app
            from mangum import Mangum
            
            # Crea handler
            mangum_handler = Mangum(app, lifespan="off")
            
            # Esegui
            return mangum_handler(event, context)
            
        except Exception as import_err:
            import_error = {
                'type': type(import_err).__name__,
                'message': str(import_err),
                'traceback': traceback.format_exc()
            }
            debug_info['import_error'] = import_error
            
            # Restituisci errore con tutte le info
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'error': 'Serverless Function Error',
                    'import_error': import_error,
                    'debug_info': debug_info
                }, indent=2)
            }
            
    except Exception as outer_err:
        # Se anche questo fallisce, restituisci almeno qualcosa
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': 'Critical Error',
                'message': str(outer_err),
                'traceback': traceback.format_exc(),
                'python_version': sys.version.split()[0] if 'sys' in dir() else 'unknown',
                'current_dir': os.getcwd() if 'os' in dir() else 'unknown'
            }, indent=2)
        }
