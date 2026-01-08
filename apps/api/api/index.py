import sys
import os

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
    # Se c'è un errore, crea un handler che mostra l'errore
    def handler(event, context):
        return {
            'statusCode': 500,
            'body': f'Error importing app: {str(e)}'
        }
