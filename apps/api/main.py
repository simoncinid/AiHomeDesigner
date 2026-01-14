import os
import sys
import re
import time
import json
import asyncio
from datetime import datetime, timedelta

# ============================================================
# LOGGING RIVOLUZIONARIO - Scrive DIRETTAMENTE a stderr
# stderr NON è bufferizzato, quindi i log appaiono SUBITO
# ============================================================

def LOG(msg: str):
    """
    Funzione di logging che scrive DIRETTAMENTE a stderr.
    stderr non è bufferizzato quindi i log appaiono IMMEDIATAMENTE su Render.
    """
    timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
    line = f"[{timestamp}] {msg}\n"
    sys.stderr.write(line)
    sys.stderr.flush()

# Test immediato - DEVE apparire su Render
LOG("=" * 60)
LOG("🚀 API SERVER STARTING")
LOG(f"Python version: {sys.version}")
LOG(f"Working directory: {os.getcwd()}")
LOG(f"PYTHONUNBUFFERED: {os.environ.get('PYTHONUNBUFFERED', 'not set')}")
LOG("=" * 60)

# Forza unbuffered anche per stdout (backup)
os.environ['PYTHONUNBUFFERED'] = '1'

# Logging standard Python (backup, ma usiamo LOG() per i messaggi critici)
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    stream=sys.stderr,  # Usa stderr!
    force=True,
)
logger = logging.getLogger(__name__)

from fastapi import FastAPI, Depends, HTTPException, Request, File, UploadFile, Form, status, BackgroundTasks
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from datetime import date

logger.info('FastAPI imports successful')

from database import get_db
logger.info('Database module imported')
from models import User, Job, CreditTransaction
from schemas import *
from wavespeed_client import (
    upload_media, submit_seedream_t2i, submit_seedream_edit,
    submit_ltx_i2v, submit_dreamina_i2v, submit_seedance_i2v, poll_result,
)
from utils import get_client_ip, hash_ip, generate_share_id, validate_prompt
from credits import (
    check_free_quota, use_free_quota, check_user_credits,
    spend_credits, grant_credits,
)
from auth import (
    verify_token, get_or_create_user, send_magic_link, create_token,
    hash_password, verify_password, generate_verification_code, send_verification_email_sync
)
from stripe_config import STRIPE_PACKS, get_pack
from prompt_builder import build_t2i_prompt, build_edit_prompt, build_quick_edit_prompt, build_video_prompt
import stripe

logger.info('Creating FastAPI app instance...')
app = FastAPI(title='AI Home Designer API', version='1.0.0')
logger.info('FastAPI app created')

# Middleware per logging semplificato (NO lettura body - può causare deadlock)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = request.headers.get('x-request-id') or str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.time()

    logger.info(
        'Request start id=%s method=%s path=%s',
        request_id,
        request.method,
        request.url.path,
    )

    try:
        response = await call_next(request)
    except Exception as exc:
        logger.exception('Unhandled error id=%s method=%s path=%s', request_id, request.method, request.url.path)
        raise

    duration_ms = int((time.time() - start_time) * 1000)
    logger.info(
        'Request end id=%s status=%s duration_ms=%s',
        request_id,
        response.status_code,
        duration_ms,
    )
    return response

# CORS is handled by ForceCORSMiddleware below - no standard middleware needed

# Handler per errori di validazione
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler per errori di validazione Pydantic."""
    logger.error(f'Validation error: {exc.errors()}')
    response = JSONResponse(
        status_code=422,
        content={
            'detail': exc.errors(),
            'body': exc.body if hasattr(exc, 'body') else None
        }
    )
    # Add CORS headers
    origin = request.headers.get('origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Handler globale per HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom handler per HTTPException che aggiunge header CORS."""
    logger.error(f'HTTPException: {exc.status_code} - {exc.detail}')
    response = JSONResponse(
        status_code=exc.status_code,
        content={'detail': exc.detail}
    )
    # Add CORS headers
    origin = request.headers.get('origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Handler globale per tutte le eccezioni non gestite
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handler globale per tutte le eccezioni non gestite."""
    logger.exception(f'Unhandled exception: {exc}')
    
    # Determina il messaggio di errore sicuro
    error_detail = 'Internal server error'
    try:
        error_str = str(exc)
        if 'FormData' in error_str or 'not JSON serializable' in error_str or 'serializable' in error_str.lower():
            error_detail = 'Invalid request format'
        elif 'ValidationError' in error_str or 'validation' in error_str.lower():
            error_detail = 'Invalid request data'
        elif len(error_str) < 200 and not any(x in error_str for x in ['<', '>', '{', '}', 'object at 0x', 'FormData']):
            error_detail = error_str
    except:
        pass
    
    response = JSONResponse(
        status_code=500,
        content={'detail': error_detail}
    )
    # Add CORS headers
    origin = request.headers.get('origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# CORS - Middleware custom che forza gli header CORS su tutte le risposte
# Questo garantisce che gli header CORS siano SEMPRE presenti
logger.info('Configuring CORS...')

def is_origin_allowed(origin: str, allowed_origins: list) -> bool:
    """Verifica se un'origine è permessa secondo la lista di origini consentite."""
    if not origin:
        return False
    
    for allowed_origin in allowed_origins:
        if '*' in allowed_origin:
            # Pattern wildcard: https://*.vercel.app -> https://.*\.vercel\.app$
            pattern = '^' + allowed_origin.replace('.', r'\.').replace('*', '.*') + '$'
            if re.match(pattern, origin):
                logger.info(f'Origin {origin} matched wildcard pattern {allowed_origin}')
                return True
        elif allowed_origin == origin:
            logger.info(f'Origin {origin} matched explicit origin {allowed_origin}')
            return True
    
    logger.warning(f'Origin {origin} NOT allowed. Allowed origins: {allowed_origins}')
    return False

class ForceCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get('origin')
        logger.info(f'Request from origin: {origin}, method: {request.method}')
        
        # Parse CORS origins dalla variabile d'ambiente
        cors_origins_env = os.getenv('CORS_ORIGINS', '')
        allow_all_origins = not cors_origins_env
        
        if cors_origins_env:
            allowed_origins = [o.strip() for o in cors_origins_env.split(',') if o.strip()]
        else:
            allowed_origins = []
            logger.warning('CORS_ORIGINS not set, allowing all origins')
        
        def should_allow_origin(orig: str) -> bool:
            """Determina se un'origine dovrebbe essere permessa."""
            if not orig:
                return False
            if allow_all_origins:
                return True
            return is_origin_allowed(orig, allowed_origins)
        
        def add_cors_headers(response):
            """Aggiunge gli header CORS alla risposta."""
            if origin and should_allow_origin(origin):
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                logger.info(f'CORS headers added for origin: {origin}')
            elif origin:
                logger.warning(f'CORS headers NOT added - origin not allowed: {origin}')
            return response
        
        # Gestisci preflight OPTIONS
        if request.method == 'OPTIONS':
            response = Response(status_code=200)
            if origin and should_allow_origin(origin):
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                response.headers['Access-Control-Max-Age'] = '3600'
                logger.info(f'OPTIONS preflight allowed for origin: {origin}')
            return response
        
        # Processa la richiesta normale - con gestione errori
        try:
            response = await call_next(request)
            return add_cors_headers(response)
        except HTTPException as he:
            # HTTPException viene gestita dall'exception handler globale
            # Rilancia così l'exception handler può aggiungere CORS
            raise he
        except Exception as e:
            logger.exception(f'Error processing request: {e}')
            # Crea una risposta di errore con header CORS
            # Non includere il dettaglio dell'errore per sicurezza
            error_detail = 'Internal server error'
            try:
                # Prova a ottenere un messaggio di errore sicuro
                error_str = str(e)
                # Rimuovi informazioni sensibili e oggetti non serializzabili
                if 'FormData' in error_str or 'not JSON serializable' in error_str or 'serializable' in error_str.lower():
                    error_detail = 'Invalid request format'
                elif len(error_str) < 200 and not any(x in error_str for x in ['<', '>', '{', '}', 'object at 0x']):
                    error_detail = error_str
            except:
                pass
            
            error_response = JSONResponse(
                status_code=500,
                content={'detail': error_detail}
            )
            return add_cors_headers(error_response)

# Aggiungi il middleware CORS
app.add_middleware(ForceCORSMiddleware)
logger.info(f'CORS middleware configured. CORS_ORIGINS: {os.getenv("CORS_ORIGINS", "NOT SET - allowing all")}')

# Run database migrations on startup
logger.info('Running database migrations...')
try:
    from alembic import command
    from alembic.config import Config
    alembic_cfg = Config('alembic.ini')
    command.upgrade(alembic_cfg, 'head')
    logger.info('Database migrations completed successfully')
except Exception as e:
    logger.error(f'Error running migrations: {e}')
    logger.warning('Continuing without migrations - tables may not exist')

# Stripe
logger.info('Configuring Stripe...')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')
logger.info(f'Stripe configured: API key present: {bool(stripe.api_key)}')

# Auth
security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Get current user from JWT token."""
    LOG('[AUTH] get_current_user called')
    
    if not credentials:
        LOG('[AUTH] No credentials provided - Authorization header missing')
        return None
    
    # Log what we received
    token = credentials.credentials
    LOG(f'[AUTH] Received token (first 30 chars): {token[:30] if token else "EMPTY"}...')
    LOG(f'[AUTH] Token length: {len(token) if token else 0}')
    
    LOG('[AUTH] Verifying token...')
    email = verify_token(token)
    if not email:
        LOG('[AUTH] Invalid token - verify_token returned None')
        return None
    
    LOG(f'[AUTH] Token valid, email={email}, fetching user...')
    user = get_or_create_user(db, email)
    LOG(f'[AUTH] User fetched id={user.id if user else None}')
    return user

# Rate limiting (simple in-memory, use Redis in production)
from collections import defaultdict
from datetime import datetime, timedelta
rate_limit_store = defaultdict(list)

def check_rate_limit(ip_hash: str, max_requests: int = 30, window_minutes: int = 60) -> bool:
    """Simple rate limiting per IP."""
    now = datetime.utcnow()
    window_start = now - timedelta(minutes=window_minutes)
    
    requests = rate_limit_store[ip_hash]
    requests[:] = [req_time for req_time in requests if req_time > window_start]
    
    if len(requests) >= max_requests:
        return False
    
    requests.append(now)
    return True

# Public endpoints
@app.get('/')
async def root():
    """Root endpoint per test rapido"""
    logger.info('Root endpoint called')
    return {'status': 'ok', 'service': 'AI Home Designer API'}

@app.get('/v1/health', response_model=HealthResponse)
async def health():
    """Health check endpoint - non richiede database"""
    logger.info('Health endpoint called')
    return {'status': 'ok'}

@app.get('/v1/pricing', response_model=PricingResponse)
async def pricing():
    photo_packs = [
        PricingPack(
            id='photo_50',
            name='50 Photo Credits',
            credits=50,
            price=9.50,
            price_id=STRIPE_PACKS['photo_50']['price_id'],
        ),
        PricingPack(
            id='photo_120',
            name='120 Photo Credits',
            credits=120,
            price=22.80,
            price_id=STRIPE_PACKS['photo_120']['price_id'],
        ),
        PricingPack(
            id='photo_300',
            name='300 Photo Credits',
            credits=300,
            price=57.00,
            price_id=STRIPE_PACKS['photo_300']['price_id'],
        ),
    ]
    
    video_packs = [
        PricingPack(
            id='video_5',
            name='5 Video Credits',
            credits=5,
            price=14.95,
            price_id=STRIPE_PACKS['video_5']['price_id'],
        ),
        PricingPack(
            id='video_12',
            name='12 Video Credits',
            credits=12,
            price=35.88,
            price_id=STRIPE_PACKS['video_12']['price_id'],
        ),
        PricingPack(
            id='video_30',
            name='30 Video Credits',
            credits=30,
            price=89.70,
            price_id=STRIPE_PACKS['video_30']['price_id'],
        ),
    ]
    
    return {'photo_packs': photo_packs, 'video_packs': video_packs}

@app.get('/v1/free-quota', response_model=FreeQuotaResponse)
async def free_quota(request: Request, db: Session = Depends(get_db)):
    ip = get_client_ip(request)
    ip_hash = hash_ip(ip)
    has_quota, remaining = check_free_quota(db, ip_hash)
    return {'remaining': remaining, 'total': 1}

# Auth endpoints
@app.post('/v1/auth/request-magic-link', response_model=MagicLinkResponse)
async def request_magic_link(data: MagicLinkRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db, data.email)
    token = create_token(data.email)
    await send_magic_link(data.email, token)
    return {'message': 'Magic link sent to your email'}

@app.get('/v1/auth/verify')
async def verify_magic_link(token: str, db: Session = Depends(get_db)):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail='Invalid or expired token')
    
    user = get_or_create_user(db, email)
    new_token = create_token(email)
    return {'token': new_token, 'user': {'id': str(user.id), 'email': user.email}}

@app.post('/v1/auth/register', response_model=RegisterResponse)
async def register(
    data: RegisterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    request: Request = None,
):
    """Register a new user."""
    request_id = getattr(request.state, 'request_id', None) if request else 'no-id'
    
    # Log immediato con print + flush per debug
    LOG(f'[REGISTER] START request_id={request_id} email={data.email}')
    
    try:
        # Validate required fields
        LOG('[REGISTER] Validating fields...')
        if not data.first_name or not data.first_name.strip():
            LOG('[REGISTER] FAIL: missing first_name')
            raise HTTPException(status_code=422, detail='First name is required')
        if not data.last_name or not data.last_name.strip():
            LOG('[REGISTER] FAIL: missing last_name')
            raise HTTPException(status_code=422, detail='Last name is required')
        if not data.email or not data.email.strip():
            LOG('[REGISTER] FAIL: missing email')
            raise HTTPException(status_code=422, detail='Email is required')
        if not data.password or len(data.password) < 8:
            LOG('[REGISTER] FAIL: weak password')
            raise HTTPException(status_code=422, detail='Password must be at least 8 characters')
        
        LOG('[REGISTER] Validation passed, checking existing user...')
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            LOG(f'[REGISTER] FAIL: user already exists id={existing_user.id}')
            raise HTTPException(status_code=400, detail='Email already registered')
        
        LOG('[REGISTER] Creating new user...')
        
        # Create user
        password_hash = hash_password(data.password)
        verification_code = generate_verification_code()
        verification_expires = datetime.utcnow() + timedelta(minutes=10)
        
        LOG(f'[REGISTER] Generated verification_code={verification_code}')
        
        user = User(
            email=data.email,
            first_name=data.first_name,
            last_name=data.last_name,
            password_hash=password_hash,
            email_verified=False,
            verification_code=verification_code,
            verification_code_expires=verification_expires,
        )
        db.add(user)
        
        LOG('[REGISTER] Committing to database...')
        db.commit()
        db.refresh(user)
        
        LOG(f'[REGISTER] User created! user_id={user.id}')
        
        # Send verification email in background
        LOG(f'[REGISTER] Scheduling verification email to {data.email}...')
        background_tasks.add_task(send_verification_email_sync, data.email, verification_code, data.first_name)
        
        LOG('[REGISTER] Returning success response')
        return {'message': 'Registration successful. Please check your email for verification code.'}
    
    except HTTPException as he:
        LOG(f'[REGISTER] HTTPException: {he.status_code} - {he.detail}')
        raise
    except Exception as e:
        LOG(f'[REGISTER] UNEXPECTED ERROR: {type(e).__name__}: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Registration failed: {str(e)}')

# @app.post('/v1/auth/register', response_model=RegisterResponse)
# async def register(data: RegisterRequest, db: Session = Depends(get_db), request: Request = None):
#     request_id = getattr(request.state, 'request_id', None) if request else None
#     logger.info('Registration test called id=%s email=%s', request_id, data.email)
#     return {"message": "ok from test register"}

@app.post('/v1/auth/login', response_model=LoginResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password."""
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail='Invalid email or password')
    
    if not user.password_hash:
        raise HTTPException(status_code=401, detail='Invalid email or password')
    
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    
    if not user.email_verified:
        raise HTTPException(status_code=403, detail='Email not verified. Please verify your email first.')
    
    token = create_token(user.email)
    return {
        'token': token,
        'user': {
            'id': str(user.id),
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }

@app.post('/v1/auth/verify-code', response_model=VerifyCodeResponse)
async def verify_code(data: VerifyCodeRequest, request: Request, db: Session = Depends(get_db)):
    """Verify email with code."""
    request_id = getattr(request.state, 'request_id', None) if request else 'no-id'
    
    LOG(f'[VERIFY] START request_id={request_id} email={data.email} code={data.code}')
    
    try:
        LOG('[VERIFY] Querying user...')
        user = db.query(User).filter(User.email == data.email).first()
        
        if not user:
            LOG('[VERIFY] FAIL: user not found')
            raise HTTPException(status_code=404, detail='User not found')
        
        LOG(f'[VERIFY] User found id={user.id} stored_code={user.verification_code}')
        
        if not user.verification_code:
            LOG('[VERIFY] FAIL: no verification code stored')
            raise HTTPException(status_code=400, detail='No verification code found')
        
        # Confronto timezone-safe: rimuovi timezone se presente
        if user.verification_code_expires:
            expires = user.verification_code_expires
            now = datetime.utcnow()
            # Se expires ha timezone, lo rendiamo naive per il confronto
            if expires.tzinfo is not None:
                expires = expires.replace(tzinfo=None)
            if expires < now:
                LOG(f'[VERIFY] FAIL: code expired at {user.verification_code_expires}')
                raise HTTPException(status_code=400, detail='Verification code expired')
        
        if user.verification_code != data.code:
            LOG(f'[VERIFY] FAIL: code mismatch (got={data.code} expected={user.verification_code})')
            raise HTTPException(status_code=400, detail='Invalid verification code')
        
        LOG('[VERIFY] Code valid! Updating user...')
        
        # Mark email as verified
        user.email_verified = True
        user.verification_code = None
        user.verification_code_expires = None
        
        LOG('[VERIFY] Committing...')
        db.commit()
        
        LOG('[VERIFY] Creating token...')
        token = create_token(user.email)
        
        LOG(f'[VERIFY] SUCCESS user_id={user.id}')
        return {
            'token': token,
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        LOG(f'[VERIFY] UNEXPECTED ERROR: {type(e).__name__}: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Verification failed: {str(e)}')

@app.get('/v1/auth/me', response_model=UserResponse)
async def get_me(request: Request, current_user: Optional[User] = Depends(get_current_user)):
    """Get current user data."""
    request_id = getattr(request.state, 'request_id', None) if request else 'no-id'
    
    LOG(f'[ME] START request_id={request_id}')
    
    if not current_user:
        LOG('[ME] FAIL: not authenticated')
        raise HTTPException(status_code=401, detail='Not authenticated')
    
    LOG(f'[ME] SUCCESS user_id={current_user.id} email={current_user.email}')
    
    return {
        'id': str(current_user.id),
        'email': current_user.email,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'credits_photo': current_user.credits_photo,
        'credits_video': current_user.credits_video,
        'email_verified': current_user.email_verified,
    }

@app.post('/v1/auth/logout')
async def logout():
    return {'message': 'Logged out'}

# Jobs endpoints
@app.post('/v1/jobs/t2i', response_model=JobResponse)
async def create_t2i_job(
    data: T2IRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    # Rate limiting
    ip = get_client_ip(request)
    ip_hash = hash_ip(ip)
    if not check_rate_limit(ip_hash):
        raise HTTPException(status_code=429, detail='Rate limit exceeded')
    
    # Validate prompt
    full_prompt = build_t2i_prompt(data.room_type, data.style_preset, data.user_prompt)
    is_valid, error_msg = validate_prompt(full_prompt)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Check credits/quota
    num_outputs = 1  # T2I generates 1 image
    photo_credits_needed = num_outputs
    
    if current_user:
        has_credits = check_user_credits(db, current_user.id, photo_needed=photo_credits_needed)
        if not has_credits:
            has_free, _ = check_free_quota(db, ip_hash)
            if not has_free:
                raise HTTPException(status_code=402, detail='Insufficient credits')
            # Use free quota
            use_free_quota(db, ip_hash)
            photo_credits_needed = 0
        else:
            spend_credits(db, current_user.id, photo_credits_needed, 0, reason='T2I generation')
    else:
        # Anonymous user
        has_free, _ = check_free_quota(db, ip_hash)
        if not has_free:
            raise HTTPException(status_code=402, detail='Free quota exhausted. Please purchase credits.')
        use_free_quota(db, ip_hash)
        photo_credits_needed = 0
    
    # Create job
    share_id = generate_share_id()
    job = Job(
        share_id=share_id,
        user_id=current_user.id if current_user else None,
        ip_hash=ip_hash,
        kind='t2i',
        status='processing',
        room_type=data.room_type,
        style_preset=data.style_preset,
        prompt=full_prompt,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Submit to WaveSpeed (for now, submit one request per output)
    try:
        request_ids = []
        for _ in range(num_outputs):
            request_id = await submit_seedream_t2i(full_prompt, data.size)
            request_ids.append(request_id)
        
        job.wavespeed_request_id = request_ids[0]  # Store first, poll all
        job.input_urls = {'request_ids': request_ids, 'num_outputs': num_outputs}
        db.commit()
    except Exception as e:
        job.status = 'failed'
        job.error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f'Generation failed: {str(e)}')
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    return JobResponse(
        id=job.id,
        share_id=job.share_id,
        status=job.status,
        kind=job.kind,
        share_url=f'{site_url}/s/{share_id}',
    )

@app.post('/v1/jobs/edit', response_model=JobResponse)
async def create_edit_job(
    request: Request,
    base_image: UploadFile = File(...),
    style_ref: Optional[UploadFile] = File(None),
    room_type: str = Form(...),
    style_preset: str = Form(...),
    edit_intent: Optional[str] = Form(None),
    user_prompt: Optional[str] = Form(None),
    size: str = Form('2048*2048'),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    LOG(f'[EDIT JOB] START - room_type={room_type}, style_preset={style_preset}, user_id={current_user.id if current_user else None}')
    
    # Rate limiting
    ip = get_client_ip(request)
    ip_hash = hash_ip(ip)
    if not check_rate_limit(ip_hash):
        LOG('[EDIT JOB] Rate limit exceeded')
        raise HTTPException(status_code=429, detail='Rate limit exceeded')
    
    # Validate file size (10MB max)
    base_image_content = await base_image.read()
    LOG(f'[EDIT JOB] Base image size: {len(base_image_content)} bytes')
    if len(base_image_content) > 10 * 1024 * 1024:
        LOG('[EDIT JOB] File too large')
        raise HTTPException(status_code=400, detail='File too large (max 10MB)')
    
    # Upload images
    try:
        LOG('[EDIT JOB] Uploading base image...')
        base_url = await upload_media(base_image_content, base_image.filename)
        LOG(f'[EDIT JOB] Base image uploaded: {base_url[:50]}...')
        images = [base_url]
        
        if style_ref:
            LOG('[EDIT JOB] Uploading style reference...')
            style_ref_content = await style_ref.read()
            if len(style_ref_content) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail='Style reference file too large')
            style_url = await upload_media(style_ref_content, style_ref.filename)
            images.append(style_url)
            LOG(f'[EDIT JOB] Style reference uploaded: {style_url[:50]}...')
    except Exception as e:
        LOG(f'[EDIT JOB] Upload failed: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Upload failed: {str(e)}')
    
    # Build prompt
    prompt = build_edit_prompt(style_preset, edit_intent=edit_intent, user_prompt=user_prompt)
    LOG(f'[EDIT JOB] Prompt built (length: {len(prompt)})')
    is_valid, error_msg = validate_prompt(prompt)
    if not is_valid:
        LOG(f'[EDIT JOB] Invalid prompt: {error_msg}')
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Check credits/quota
    num_outputs = 1  # Edit generates 1 variation
    photo_credits_needed = num_outputs
    
    if current_user:
        has_credits = check_user_credits(db, current_user.id, photo_needed=photo_credits_needed)
        LOG(f'[EDIT JOB] User credits check: has_credits={has_credits}')
        if not has_credits:
            has_free, _ = check_free_quota(db, ip_hash)
            if not has_free:
                LOG('[EDIT JOB] No credits and no free quota')
                raise HTTPException(status_code=402, detail='Insufficient credits')
            use_free_quota(db, ip_hash)
            photo_credits_needed = 0
            LOG('[EDIT JOB] Using free quota')
        else:
            spend_credits(db, current_user.id, photo_credits_needed, 0, reason='Edit generation')
            LOG(f'[EDIT JOB] Spent {photo_credits_needed} photo credits')
    else:
        has_free, _ = check_free_quota(db, ip_hash)
        if not has_free:
            LOG('[EDIT JOB] Anonymous user, no free quota')
            raise HTTPException(status_code=402, detail='Free quota exhausted. Please purchase credits.')
        use_free_quota(db, ip_hash)
        photo_credits_needed = 0
        LOG('[EDIT JOB] Anonymous user, using free quota')
    
    # Create job
    share_id = generate_share_id()
    LOG(f'[EDIT JOB] Creating job with share_id={share_id}')
    job = Job(
        share_id=share_id,
        user_id=current_user.id if current_user else None,
        ip_hash=ip_hash,
        kind='edit',
        status='processing',
        room_type=room_type,
        style_preset=style_preset,
        prompt=prompt,
        input_urls={'images': images, 'num_outputs': num_outputs},
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    LOG(f'[EDIT JOB] Job created: id={job.id}, status={job.status}')
    
    # Submit to WaveSpeed
    try:
        LOG('[EDIT JOB] Submitting to WaveSpeed...')
        request_ids = []
        for i in range(num_outputs):
            LOG(f'[EDIT JOB] Submitting request {i+1}/{num_outputs}...')
            request_id = await submit_seedream_edit(prompt, images, size)
            request_ids.append(request_id)
            LOG(f'[EDIT JOB] WaveSpeed request_id={request_id}')
        
        job.wavespeed_request_id = request_ids[0]
        job.input_urls = {**job.input_urls, 'request_ids': request_ids}
        db.commit()
        LOG(f'[EDIT JOB] Job updated with request_ids: {request_ids}')
    except Exception as e:
        LOG(f'[EDIT JOB] WaveSpeed submission failed: {str(e)}')
        job.status = 'failed'
        job.error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f'Generation failed: {str(e)}')
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    LOG(f'[EDIT JOB] SUCCESS - job_id={job.id}, share_id={share_id}')
    return JobResponse(
        id=job.id,
        share_id=job.share_id,
        status=job.status,
        kind=job.kind,
        share_url=f'{site_url}/s/{share_id}',
    )

@app.post('/v1/jobs/i2v', response_model=JobResponse)
async def create_i2v_job(
    request: Request,
    image: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    motion_preset: str = Form(...),
    prompt: Optional[str] = Form(None),
    user_prompt: Optional[str] = Form(None),
    duration: int = Form(5),
    aspect_ratio: str = Form('16:9'),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    # Rate limiting
    ip = get_client_ip(request)
    ip_hash = hash_ip(ip)
    if not check_rate_limit(ip_hash):
        raise HTTPException(status_code=429, detail='Rate limit exceeded')
    
    # Video always requires credits
    if not current_user:
        raise HTTPException(status_code=401, detail='Authentication required for video generation')
    
    if not check_user_credits(db, current_user.id, video_needed=1):
        raise HTTPException(status_code=402, detail='Insufficient video credits')
    
    # Validate duration (5-12 seconds)
    if duration < 5 or duration > 12:
        raise HTTPException(status_code=400, detail='Duration must be between 5 and 12 seconds')
    
    # Validate aspect ratio
    valid_aspect_ratios = ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16']
    if aspect_ratio not in valid_aspect_ratios:
        raise HTTPException(status_code=400, detail=f'Invalid aspect ratio. Must be one of: {", ".join(valid_aspect_ratios)}')
    
    # Get image URL
    if image:
        image_content = await image.read()
        if len(image_content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail='File too large (max 10MB)')
        image_url = await upload_media(image_content, image.filename)
    elif not image_url:
        raise HTTPException(status_code=400, detail='Either image file or image_url required')
    
    # Build video prompt based on motion preset and user input
    if not prompt:
        base_prompt = build_video_prompt(motion_preset)
        
        # Combine with user prompt if provided
        if user_prompt and user_prompt.strip():
            # Combine base prompt with user's custom instructions
            prompt = f"{base_prompt} {user_prompt.strip()}"
        else:
            prompt = base_prompt
    
    is_valid, error_msg = validate_prompt(prompt)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Spend credits
    spend_credits(db, current_user.id, 0, 1, reason='I2V generation')
    
    # Create job
    share_id = generate_share_id()
    job = Job(
        share_id=share_id,
        user_id=current_user.id,
        ip_hash=ip_hash,
        kind='i2v',
        status='processing',
        prompt=prompt,
        input_urls={'image_url': image_url},
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Submit to WaveSpeed using Seedance v1.5-pro
    try:
        request_id = await submit_seedance_i2v(image_url, prompt, duration, aspect_ratio)
        job.wavespeed_request_id = request_id
        db.commit()
    except Exception as e:
        job.status = 'failed'
        job.error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f'Generation failed: {str(e)}')
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    return JobResponse(
        id=job.id,
        share_id=job.share_id,
        status=job.status,
        kind=job.kind,
        share_url=f'{site_url}/s/{share_id}',
    )

@app.get('/v1/jobs/{job_id}', response_model=JobResponse)
async def get_job(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    LOG(f'[GET JOB] Request for job_id={job_id}')
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        LOG(f'[GET JOB] Job {job_id} not found')
        raise HTTPException(status_code=404, detail='Job not found')
    
    LOG(f'[GET JOB] Job found: status={job.status}, kind={job.kind}, wavespeed_request_id={job.wavespeed_request_id}')
    
    # Poll WaveSpeed if still processing
    if job.status == 'processing' and job.wavespeed_request_id:
        LOG(f'[GET JOB] Polling WaveSpeed for request_id={job.wavespeed_request_id}')
        try:
            result = await poll_result(job.wavespeed_request_id)
            LOG(f'[GET JOB] WaveSpeed poll result: status={result.get("status")}, has_outputs={bool(result.get("outputs"))}')
            
            if result['status'] == 'completed':
                outputs = result.get('outputs', [])
                if isinstance(outputs, list) and len(outputs) > 0:
                    # Handle multiple outputs for t2i/edit
                    input_urls_dict = job.input_urls if isinstance(job.input_urls, dict) else {}
                    if job.kind in ['t2i', 'edit'] and 'request_ids' in input_urls_dict:
                        LOG(f'[GET JOB] Multiple request_ids found: {input_urls_dict.get("request_ids")}')
                        # Poll all request IDs
                        all_outputs = []
                        request_ids = input_urls_dict.get('request_ids', [])
                        for idx, req_id in enumerate(request_ids):
                            LOG(f'[GET JOB] Polling request_id {idx+1}/{len(request_ids)}: {req_id}')
                            try:
                                req_result = await poll_result(req_id)
                                LOG(f'[GET JOB] Request {req_id} status: {req_result.get("status")}')
                                if req_result['status'] == 'completed':
                                    req_outputs = req_result.get('outputs', [])
                                    if isinstance(req_outputs, list):
                                        all_outputs.extend(req_outputs)
                                    LOG(f'[GET JOB] Request {req_id} completed with {len(req_outputs)} outputs')
                                elif req_result['status'] == 'failed':
                                    LOG(f'[GET JOB] Request {req_id} failed: {req_result.get("error")}')
                            except Exception as e:
                                LOG(f'[GET JOB] Error polling request_id {req_id}: {str(e)}')
                        
                        if all_outputs:
                            job.output_urls = all_outputs
                            job.status = 'completed'
                            LOG(f'[GET JOB] Job completed with {len(all_outputs)} outputs')
                        else:
                            job.status = 'failed'
                            job.error = 'No outputs received from any request'
                            LOG('[GET JOB] No outputs from any request')
                    else:
                        job.output_urls = outputs
                        job.status = 'completed'
                        LOG(f'[GET JOB] Job completed with {len(outputs)} outputs (single request)')
                else:
                    job.status = 'failed'
                    job.error = 'No outputs received'
                    LOG('[GET JOB] No outputs in result')
            elif result['status'] == 'failed':
                job.status = 'failed'
                job.error = result.get('error', 'Generation failed')
                LOG(f'[GET JOB] WaveSpeed returned failed: {job.error}')
            elif result['status'] == 'processing':
                LOG('[GET JOB] Still processing...')
            else:
                LOG(f'[GET JOB] Unknown status: {result.get("status")}')
            
            db.commit()
            LOG(f'[GET JOB] Job status updated to: {job.status}')
        except Exception as e:
            LOG(f'[GET JOB] Error polling WaveSpeed: {str(e)}')
            logger.exception('Error polling WaveSpeed')
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    response = JobResponse(
        id=job.id,
        share_id=job.share_id,
        status=job.status,
        kind=job.kind,
        input_urls=job.input_urls if isinstance(job.input_urls, list) else None,
        output_urls=job.output_urls,
        error=job.error,
        share_url=f'{site_url}/s/{job.share_id}',
    )
    LOG(f'[GET JOB] Returning response: status={response.status}, has_outputs={bool(response.output_urls)}')
    return response

@app.get('/v1/jobs/share/{share_id}', response_model=JobResponse)
async def get_job_by_share_id(
    share_id: str,
    db: Session = Depends(get_db),
):
    """Get job by share_id for public sharing."""
    job = db.query(Job).filter(Job.share_id == share_id).first()
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    
    # Poll WaveSpeed if still processing (same logic as get_job)
    if job.status == 'processing' and job.wavespeed_request_id:
        try:
            result = await poll_result(job.wavespeed_request_id)
            
            if result['status'] == 'completed':
                outputs = result.get('outputs', [])
                if isinstance(outputs, list) and len(outputs) > 0:
                    if job.kind in ['t2i', 'edit'] and 'request_ids' in (job.input_urls or {}):
                        all_outputs = []
                        for req_id in job.input_urls.get('request_ids', []):
                            req_result = await poll_result(req_id)
                            if req_result['status'] == 'completed':
                                all_outputs.extend(req_result.get('outputs', []))
                        job.output_urls = all_outputs
                    else:
                        job.output_urls = outputs
                    job.status = 'completed'
                else:
                    job.status = 'failed'
                    job.error = 'No outputs received'
            elif result['status'] == 'failed':
                job.status = 'failed'
                job.error = result.get('error', 'Generation failed')
            
            db.commit()
        except Exception as e:
            print(f'Error polling WaveSpeed: {e}')
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    return JobResponse(
        id=job.id,
        share_id=job.share_id,
        status=job.status,
        kind=job.kind,
        input_urls=job.input_urls if isinstance(job.input_urls, list) else None,
        output_urls=job.output_urls,
        error=job.error,
        share_url=f'{site_url}/s/{job.share_id}',
    )

@app.post('/v1/jobs/{job_id}/make-public', response_model=MakePublicResponse)
async def make_job_public(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail='Authentication required')
    
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    
    if job.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Not your job')
    
    job.is_public = True
    db.commit()
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    return MakePublicResponse(
        share_url=f'{site_url}/s/{job.share_id}',
        message='Job is now public',
    )

@app.get('/v1/gallery', response_model=GalleryResponse)
async def get_gallery(
    limit: int = 12,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """Get public gallery items - no authentication required."""
    # Get only completed, public jobs with output URLs
    jobs = db.query(Job).filter(
        Job.is_public == True,
        Job.status == 'completed',
        Job.output_urls.isnot(None),
    ).order_by(Job.created_at.desc()).offset(offset).limit(limit).all()
    
    total = db.query(Job).filter(
        Job.is_public == True,
        Job.status == 'completed',
        Job.output_urls.isnot(None),
    ).count()
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    items = []
    for job in jobs:
        # Only include jobs with valid output URLs
        output_urls = job.output_urls if isinstance(job.output_urls, list) else []
        if not output_urls:
            continue
            
        items.append(GalleryItemResponse(
            id=job.id,
            share_id=job.share_id,
            kind=job.kind,
            input_urls=job.input_urls if isinstance(job.input_urls, list) else None,
            output_urls=output_urls,
            room_type=job.room_type,
            style_preset=job.style_preset,
            share_url=f'{site_url}/s/{job.share_id}',
            created_at=job.created_at.isoformat() if job.created_at else '',
        ))
    
    return GalleryResponse(items=items, total=total)

@app.get('/v1/jobs/history')
async def get_job_history(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Get user's job history."""
    if not current_user:
        raise HTTPException(status_code=401, detail='Authentication required')
    
    jobs = db.query(Job).filter(
        Job.user_id == current_user.id,
    ).order_by(Job.created_at.desc()).offset(offset).limit(limit).all()
    
    total = db.query(Job).filter(Job.user_id == current_user.id).count()
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    items = []
    for job in jobs:
        items.append({
            'id': str(job.id),
            'share_id': job.share_id,
            'status': job.status,
            'kind': job.kind,
            'input_urls': job.input_urls if isinstance(job.input_urls, dict) and 'images' in job.input_urls else None,
            'output_urls': job.output_urls if isinstance(job.output_urls, list) else None,
            'error': job.error,
            'room_type': job.room_type,
            'style_preset': job.style_preset,
            'share_url': f'{site_url}/s/{job.share_id}',
            'created_at': job.created_at.isoformat() if job.created_at else '',
        })
    
    return {'items': items, 'total': total}

@app.get('/v1/transactions')
async def get_transactions(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Get user's credit transactions."""
    if not current_user:
        raise HTTPException(status_code=401, detail='Authentication required')
    
    transactions = db.query(CreditTransaction).filter(
        CreditTransaction.user_id == current_user.id,
    ).order_by(CreditTransaction.created_at.desc()).offset(offset).limit(limit).all()
    
    total = db.query(CreditTransaction).filter(CreditTransaction.user_id == current_user.id).count()
    
    items = []
    for tx in transactions:
        items.append({
            'id': str(tx.id),
            'kind': tx.kind,
            'photo_delta': tx.photo_delta,
            'video_delta': tx.video_delta,
            'reason': tx.reason,
            'created_at': tx.created_at.isoformat() if tx.created_at else '',
        })
    
    return {'items': items, 'total': total}

# Stripe endpoints
@app.post('/v1/stripe/create-checkout', response_model=CreateCheckoutResponse)
async def create_checkout(
    data: CreateCheckoutRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    pack = get_pack(data.pack_id)
    if not pack:
        raise HTTPException(status_code=400, detail='Invalid pack ID')
    
    # Get or create user
    if not current_user:
        # For anonymous checkout, we'll create user after payment
        email = None
    else:
        email = current_user.email
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(email=email)
            current_user.stripe_customer_id = customer.id
            db.commit()
    
    # Create checkout session
    session_params = {
        'payment_method_types': ['card'],
        'line_items': [{
            'price': pack['price_id'],
            'quantity': 1,
        }],
        'mode': 'payment',
        'success_url': f'{os.getenv("SITE_URL")}/app/account?success=true',
        'cancel_url': f'{os.getenv("SITE_URL")}/pricing?canceled=true',
        'metadata': {
            'pack_id': data.pack_id,
        },
    }
    
    if email:
        session_params['customer_email'] = email
        if current_user and current_user.stripe_customer_id:
            session_params['customer'] = current_user.stripe_customer_id
    
    session = stripe.checkout.Session.create(**session_params)
    
    return CreateCheckoutResponse(url=session.url)

# Prezzi per credito (in centesimi)
PRICE_PER_PHOTO_CREDIT = 19  # $0.19
PRICE_PER_VIDEO_CREDIT = 299  # $2.99

@app.post('/v1/stripe/create-dynamic-checkout', response_model=DynamicCheckoutResponse)
async def create_dynamic_checkout(
    data: DynamicCheckoutRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Create a Stripe checkout session with dynamic pricing based on selected credits."""
    LOG(f'[STRIPE] Dynamic checkout request: photo={data.photo_credits}, video={data.video_credits}')
    
    if not current_user:
        raise HTTPException(status_code=401, detail='Authentication required')
    
    if data.photo_credits < 0 or data.video_credits < 0:
        raise HTTPException(status_code=400, detail='Credits cannot be negative')
    
    if data.photo_credits == 0 and data.video_credits == 0:
        raise HTTPException(status_code=400, detail='Select at least one credit to purchase')
    
    # Calcola il totale in centesimi
    photo_amount = data.photo_credits * PRICE_PER_PHOTO_CREDIT
    video_amount = data.video_credits * PRICE_PER_VIDEO_CREDIT
    total_amount_cents = photo_amount + video_amount
    
    if total_amount_cents < 50:  # Stripe minimum is $0.50
        raise HTTPException(status_code=400, detail='Minimum purchase amount is $0.50')
    
    LOG(f'[STRIPE] Total amount: ${total_amount_cents / 100:.2f}')
    
    # Crea o aggiorna customer Stripe
    if not current_user.stripe_customer_id:
        customer = stripe.Customer.create(email=current_user.email)
        current_user.stripe_customer_id = customer.id
        db.commit()
    
    # Costruisci la descrizione
    line_items = []
    
    if data.photo_credits > 0:
        line_items.append({
            'price_data': {
                'currency': 'usd',
                'unit_amount': PRICE_PER_PHOTO_CREDIT,
                'product_data': {
                    'name': 'Photo Credit',
                    'description': 'Generate AI interior designs',
                },
            },
            'quantity': data.photo_credits,
        })
    
    if data.video_credits > 0:
        line_items.append({
            'price_data': {
                'currency': 'usd',
                'unit_amount': PRICE_PER_VIDEO_CREDIT,
                'product_data': {
                    'name': 'Video Credit',
                    'description': 'Create cinematic room videos',
                },
            },
            'quantity': data.video_credits,
        })
    
    # Crea la sessione Stripe
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=line_items,
        mode='payment',
        success_url=f'{os.getenv("SITE_URL")}/app/account?success=true',
        cancel_url=f'{os.getenv("SITE_URL")}/app/account?canceled=true',
        customer=current_user.stripe_customer_id,
        metadata={
            'type': 'dynamic_credits',
            'photo_credits': str(data.photo_credits),
            'video_credits': str(data.video_credits),
            'user_id': str(current_user.id),
        },
    )
    
    LOG(f'[STRIPE] Created checkout session: {session.id}')
    
    return DynamicCheckoutResponse(
        url=session.url,
        total_amount=total_amount_cents / 100,
        photo_credits=data.photo_credits,
        video_credits=data.video_credits,
    )

@app.post('/v1/stripe/webhook')
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail='Invalid payload')
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail='Invalid signature')
    
    # Handle checkout.session.completed
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        metadata = session.get('metadata', {})
        
        # Check if already processed
        event_id = event['id']
        existing = db.query(CreditTransaction).filter(
            CreditTransaction.stripe_event_id == event_id
        ).first()
        
        if existing:
            LOG(f'[STRIPE WEBHOOK] Event {event_id} already processed, skipping')
            return {'status': 'ok'}
        
        # Determina il tipo di acquisto
        checkout_type = metadata.get('type')
        
        if checkout_type == 'dynamic_credits':
            # Acquisto dinamico con crediti personalizzati
            LOG(f'[STRIPE WEBHOOK] Processing dynamic credits purchase')
            
            photo_credits = int(metadata.get('photo_credits', 0))
            video_credits = int(metadata.get('video_credits', 0))
            user_id = metadata.get('user_id')
            
            if not user_id:
                LOG('[STRIPE WEBHOOK] No user_id in metadata, cannot grant credits')
                return {'status': 'ok'}
            
            # Trova l'utente
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                LOG(f'[STRIPE WEBHOOK] User {user_id} not found')
                return {'status': 'ok'}
            
            # Aggiorna Stripe customer ID se disponibile
            customer_id = session.get('customer')
            if customer_id and not user.stripe_customer_id:
                user.stripe_customer_id = customer_id
                db.commit()
            
            # Assegna i crediti
            amount_paid = session.get('amount_total', 0) / 100  # Convert from cents
            grant_credits(
                db,
                user.id,
                photo_credits,
                video_credits,
                reason=f'Stripe purchase: {photo_credits} photo + {video_credits} video credits (${amount_paid:.2f})',
                stripe_event_id=event_id,
            )
            
            LOG(f'[STRIPE WEBHOOK] Granted {photo_credits} photo + {video_credits} video credits to user {user.email}')
        
        else:
            # Acquisto con pack predefinito (legacy)
            pack_id = metadata.get('pack_id')
            
            if not pack_id:
                LOG('[STRIPE WEBHOOK] No pack_id or type in metadata, ignoring')
                return {'status': 'ok'}
            
            pack = get_pack(pack_id)
            if not pack:
                LOG(f'[STRIPE WEBHOOK] Invalid pack_id: {pack_id}')
                return {'status': 'ok'}
            
            email = session.get('customer_email') or session.get('customer_details', {}).get('email')
            if not email:
                LOG('[STRIPE WEBHOOK] No email found, cannot grant credits')
                return {'status': 'ok'}
            
            # Get or create user
            user = get_or_create_user(db, email)
            
            # Update Stripe customer ID if available
            customer_id = session.get('customer')
            if customer_id and not user.stripe_customer_id:
                user.stripe_customer_id = customer_id
                db.commit()
            
            # Grant credits
            photo_credits = pack['credits'] if 'photo' in pack_id else 0
            video_credits = pack['credits'] if 'video' in pack_id else 0
            
            grant_credits(
                db,
                user.id,
                photo_credits,
                video_credits,
                reason=f'Stripe purchase: {pack_id}',
                stripe_event_id=event_id,
            )
            
            LOG(f'[STRIPE WEBHOOK] Granted {photo_credits} photo + {video_credits} video credits from pack {pack_id}')
    
    return {'status': 'ok'}
