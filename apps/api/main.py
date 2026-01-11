import os
import sys
import logging
import re

# Configura logging prima di tutto
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info('=' * 50)
logger.info('Starting FastAPI app initialization')
logger.info(f'Python: {sys.version}')
logger.info(f'Working directory: {os.getcwd()}')

from fastapi import FastAPI, Depends, HTTPException, Request, File, UploadFile, Form, status
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
    submit_ltx_i2v, poll_result,
)
from utils import get_client_ip, hash_ip, generate_share_id, validate_prompt
from credits import (
    check_free_quota, use_free_quota, check_user_credits,
    spend_credits, grant_credits,
)
from auth import (
    verify_token, get_or_create_user, send_magic_link, create_token,
    hash_password, verify_password, generate_verification_code, send_verification_email
)
from stripe_config import STRIPE_PACKS, get_pack
from prompt_builder import build_t2i_prompt, build_edit_prompt, build_quick_edit_prompt, build_video_prompt
import stripe

logger.info('Creating FastAPI app instance...')
app = FastAPI(title='AI Home Designer API', version='1.0.0')
logger.info('FastAPI app created')

# Handler per errori di validazione
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler per errori di validazione Pydantic."""
    logger.error(f'Validation error: {exc.errors()}')
    return JSONResponse(
        status_code=422,
        content={
            'detail': exc.errors(),
            'body': exc.body if hasattr(exc, 'body') else None
        }
    )

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
        if cors_origins_env:
            allowed_origins = [o.strip() for o in cors_origins_env.split(',') if o.strip()]
        else:
            # Se non specificato, permette tutte le origini (solo per sviluppo)
            allowed_origins = []
            logger.warning('CORS_ORIGINS not set, allowing all origins')
        
        # Gestisci preflight OPTIONS
        if request.method == 'OPTIONS':
            response = Response(status_code=200)
            if origin:
                if not cors_origins_env or is_origin_allowed(origin, allowed_origins):
                    response.headers['Access-Control-Allow-Origin'] = origin
                    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD'
                    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With'
                    response.headers['Access-Control-Allow-Credentials'] = 'true'
                    response.headers['Access-Control-Max-Age'] = '3600'
                    logger.info(f'OPTIONS preflight allowed for origin: {origin}')
            return response
        
        # Processa la richiesta normale
        response = await call_next(request)
        
        # Aggiungi header CORS alla risposta
        if origin:
            if not cors_origins_env or is_origin_allowed(origin, allowed_origins):
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                logger.info(f'CORS headers added for origin: {origin}')
            else:
                logger.warning(f'CORS headers NOT added - origin not allowed: {origin}')
        else:
            logger.info('No origin header in request')
        
        return response

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
    if not credentials:
        return None
    
    email = verify_token(credentials.credentials)
    if not email:
        return None
    
    return get_or_create_user(db, email)

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
async def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user."""
    logger.info(f'Registration attempt for email: {data.email}')
    
    # Validate required fields
    if not data.first_name or not data.first_name.strip():
        raise HTTPException(status_code=422, detail='First name is required')
    if not data.last_name or not data.last_name.strip():
        raise HTTPException(status_code=422, detail='Last name is required')
    if not data.email or not data.email.strip():
        raise HTTPException(status_code=422, detail='Email is required')
    if not data.password or len(data.password) < 8:
        raise HTTPException(status_code=422, detail='Password must be at least 8 characters')
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    # Create user
    password_hash = hash_password(data.password)
    verification_code = generate_verification_code()
    verification_expires = datetime.utcnow() + timedelta(minutes=10)
    
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
    db.commit()
    db.refresh(user)
    
    # Send verification email
    await send_verification_email(data.email, verification_code, data.first_name)
    
    return {'message': 'Registration successful. Please check your email for verification code.'}

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
async def verify_code(data: VerifyCodeRequest, db: Session = Depends(get_db)):
    """Verify email with code."""
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    if not user.verification_code:
        raise HTTPException(status_code=400, detail='No verification code found')
    
    if user.verification_code_expires and user.verification_code_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail='Verification code expired')
    
    if user.verification_code != data.code:
        raise HTTPException(status_code=400, detail='Invalid verification code')
    
    # Mark email as verified
    user.email_verified = True
    user.verification_code = None
    user.verification_code_expires = None
    db.commit()
    
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

@app.get('/v1/auth/me', response_model=UserResponse)
async def get_me(current_user: Optional[User] = Depends(get_current_user)):
    """Get current user data."""
    if not current_user:
        raise HTTPException(status_code=401, detail='Not authenticated')
    
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
    num_outputs = 2  # T2I generates 2 images
    photo_credits_needed = num_outputs
    
    if current_user:
        has_credits = check_user_credits(db, current_user.id, photo_needed=photo_credits_needed)
        if not has_credits:
            has_free, _ = check_free_quota(db, ip_hash)
            if not has_free:
                raise HTTPException(status_code=402, detail='Insufficient credits')
            # Use free quota
            use_free_quota(db, ip_hash)
            # Only generate 1 image for free tier
            num_outputs = 1
            photo_credits_needed = 0
        else:
            spend_credits(db, current_user.id, photo_credits_needed, 0, reason='T2I generation')
    else:
        # Anonymous user
        has_free, _ = check_free_quota(db, ip_hash)
        if not has_free:
            raise HTTPException(status_code=402, detail='Free quota exhausted. Please purchase credits.')
        use_free_quota(db, ip_hash)
        num_outputs = 1
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
    size: str = Form('2048*2048'),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    # Rate limiting
    ip = get_client_ip(request)
    ip_hash = hash_ip(ip)
    if not check_rate_limit(ip_hash):
        raise HTTPException(status_code=429, detail='Rate limit exceeded')
    
    # Validate file size (10MB max)
    base_image_content = await base_image.read()
    if len(base_image_content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail='File too large (max 10MB)')
    
    # Upload images
    try:
        base_url = await upload_media(base_image_content, base_image.filename)
        images = [base_url]
        
        if style_ref:
            style_ref_content = await style_ref.read()
            if len(style_ref_content) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail='Style reference file too large')
            style_url = await upload_media(style_ref_content, style_ref.filename)
            images.append(style_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Upload failed: {str(e)}')
    
    # Build prompt
    prompt = build_edit_prompt(style_preset, edit_intent=edit_intent)
    is_valid, error_msg = validate_prompt(prompt)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Check credits/quota
    num_outputs = 4  # Edit generates 4 variations
    photo_credits_needed = num_outputs
    
    if current_user:
        has_credits = check_user_credits(db, current_user.id, photo_needed=photo_credits_needed)
        if not has_credits:
            has_free, _ = check_free_quota(db, ip_hash)
            if not has_free:
                raise HTTPException(status_code=402, detail='Insufficient credits')
            use_free_quota(db, ip_hash)
            num_outputs = 1
            photo_credits_needed = 0
        else:
            spend_credits(db, current_user.id, photo_credits_needed, 0, reason='Edit generation')
    else:
        has_free, _ = check_free_quota(db, ip_hash)
        if not has_free:
            raise HTTPException(status_code=402, detail='Free quota exhausted. Please purchase credits.')
        use_free_quota(db, ip_hash)
        num_outputs = 1
        photo_credits_needed = 0
    
    # Create job
    share_id = generate_share_id()
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
    
    # Submit to WaveSpeed
    try:
        request_ids = []
        for _ in range(num_outputs):
            request_id = await submit_seedream_edit(prompt, images, size)
            request_ids.append(request_id)
        
        job.wavespeed_request_id = request_ids[0]
        job.input_urls = {**job.input_urls, 'request_ids': request_ids}
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

@app.post('/v1/jobs/i2v', response_model=JobResponse)
async def create_i2v_job(
    request: Request,
    image: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    motion_preset: str = Form(...),
    prompt: Optional[str] = Form(None),
    duration: int = Form(5),
    resolution: str = Form('720p'),
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
    
    # Get image URL
    if image:
        image_content = await image.read()
        if len(image_content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail='File too large (max 10MB)')
        image_url = await upload_media(image_content, image.filename)
    elif not image_url:
        raise HTTPException(status_code=400, detail='Either image file or image_url required')
    
    # Build video prompt
    if not prompt:
        prompt = build_video_prompt(motion_preset)
    
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
    
    # Submit to WaveSpeed
    try:
        request_id = await submit_ltx_i2v(image_url, prompt, duration, resolution)
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
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    
    # Poll WaveSpeed if still processing
    if job.status == 'processing' and job.wavespeed_request_id:
        try:
            result = await poll_result(job.wavespeed_request_id)
            
            if result['status'] == 'completed':
                outputs = result.get('outputs', [])
                if isinstance(outputs, list) and len(outputs) > 0:
                    # Handle multiple outputs for t2i/edit
                    if job.kind in ['t2i', 'edit'] and 'request_ids' in (job.input_urls or {}):
                        # Poll all request IDs
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
            # Don't fail the request, just log
            print(f'Error polling WaveSpeed: {e}')
    
    site_url = os.getenv('SITE_URL', 'http://localhost:3000')
    return JobResponse(
        id=job.id,
        share_id=job.share_id,
        status=job.status,
        kind=job.kind,
        output_urls=job.output_urls,
        error=job.error,
        share_url=f'{site_url}/s/{job.share_id}',
    )

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
        pack_id = session.get('metadata', {}).get('pack_id')
        
        if not pack_id:
            return {'status': 'ok'}  # Ignore if no pack_id
        
        pack = get_pack(pack_id)
        if not pack:
            return {'status': 'ok'}  # Ignore invalid pack
        
        email = session.get('customer_email') or session.get('customer_details', {}).get('email')
        if not email:
            return {'status': 'ok'}  # Ignore if no email
        
        # Check if already processed
        event_id = event['id']
        existing = db.query(CreditTransaction).filter(
            CreditTransaction.stripe_event_id == event_id
        ).first()
        
        if existing:
            return {'status': 'ok'}  # Already processed
        
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
    
    return {'status': 'ok'}
