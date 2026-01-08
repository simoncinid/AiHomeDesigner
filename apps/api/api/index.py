import sys
import os

# Aggiungi la directory parent al path per importare i moduli
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from mangum import Mangum

# Wrappa l'app FastAPI con Mangum per compatibilità Vercel/Lambda
handler = Mangum(app, lifespan="off")
