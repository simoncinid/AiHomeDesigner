import os
import sys
import jwt
from passlib.context import CryptContext
import secrets
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from models import User
import logging
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

def LOG(msg: str):
    """
    Scrive DIRETTAMENTE a stderr - NON bufferizzato!
    DEVE apparire immediatamente su Render.
    """
    timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
    line = f"[{timestamp}] {msg}\n"
    sys.stderr.write(line)
    sys.stderr.flush()

# Usa Argon2 invece di bcrypt - più sicuro e NESSUN limite di lunghezza password
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

JWT_SECRET = os.getenv('JWT_SECRET', 'change_me_in_production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24
SITE_URL = os.getenv('SITE_URL', 'http://localhost:3000')

# Gmail SMTP configuration
GMAIL_USER = os.getenv('GMAIL_USER', 'reservationwebbitz@gmail.com')
GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')

def create_token(email: str) -> str:
    """Create JWT token for user."""
    LOG(f'[CREATE_TOKEN] Creating token for email={email}')
    LOG(f'[CREATE_TOKEN] JWT_SECRET set: {bool(os.getenv("JWT_SECRET"))}')
    payload = {
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    LOG(f'[CREATE_TOKEN] Token created (first 20 chars): {token[:20]}...')
    return token

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email."""
    LOG(f'[VERIFY_TOKEN] Verifying token (first 20 chars): {token[:20] if token else "EMPTY"}...')
    LOG(f'[VERIFY_TOKEN] JWT_SECRET set: {bool(os.getenv("JWT_SECRET"))}')
    
    if not token:
        LOG('[VERIFY_TOKEN] ERROR: Empty token')
        return None
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get('email')
        LOG(f'[VERIFY_TOKEN] SUCCESS: email={email}')
        return email
    except jwt.ExpiredSignatureError:
        LOG('[VERIFY_TOKEN] ERROR: Token expired')
        return None
    except jwt.InvalidTokenError as e:
        LOG(f'[VERIFY_TOKEN] ERROR: Invalid token - {type(e).__name__}: {str(e)}')
        return None
    except Exception as e:
        LOG(f'[VERIFY_TOKEN] ERROR: Unexpected - {type(e).__name__}: {str(e)}')
        return None

def send_email_smtp(to_email: str, subject: str, html_content: str) -> bool:
    """Send email via Gmail SMTP.
    
    Requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables.
    Questa funzione è SINCRONA e blocca finché l'email non è inviata.
    """
    LOG('='*60)
    LOG(f'[EMAIL] SEND_EMAIL_SMTP START')
    LOG(f'[EMAIL]   to: {to_email}')
    LOG(f'[EMAIL]   subject: {subject}')
    LOG(f'[EMAIL]   GMAIL_USER: {GMAIL_USER}')
    LOG(f'[EMAIL]   GMAIL_APP_PASSWORD configured: {bool(GMAIL_APP_PASSWORD)}')
    
    if not GMAIL_APP_PASSWORD:
        LOG('[EMAIL] ERROR: GMAIL_APP_PASSWORD not configured!')
        LOG('='*60)
        return False
    
    try:
        # Create message
        LOG('[EMAIL] Creating message...')
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f'AI Home Designer <{GMAIL_USER}>'
        msg['To'] = to_email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        LOG('[EMAIL] Message created')
        
        # Connect to Gmail SMTP
        LOG('[EMAIL] Connecting to smtp.gmail.com:587...')
        with smtplib.SMTP('smtp.gmail.com', 587, timeout=30) as server:
            LOG('[EMAIL] Connected! Starting TLS...')
            server.starttls()
            LOG('[EMAIL] TLS started. Logging in...')
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            LOG('[EMAIL] Logged in! Sending email...')
            server.sendmail(GMAIL_USER, to_email, msg.as_string())
        
        LOG(f'[EMAIL] SUCCESS: Email sent to {to_email}')
        LOG('='*60)
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        LOG(f'[EMAIL] ERROR: SMTP Authentication failed: {e}')
        LOG('[EMAIL] Check GMAIL_USER and GMAIL_APP_PASSWORD')
        LOG('='*60)
        return False
    except smtplib.SMTPException as e:
        LOG(f'[EMAIL] ERROR: SMTP error: {type(e).__name__}: {e}')
        LOG('='*60)
        return False
    except Exception as e:
        LOG(f'[EMAIL] ERROR: Unexpected error: {type(e).__name__}: {e}')
        import traceback
        traceback.print_exc()
        sys.stdout.flush()
        LOG('='*60)
        return False

async def send_magic_link(email: str, token: str):
    """Send magic link email via Gmail SMTP."""
    magic_link = f'{SITE_URL}/auth/verify?token={token}'
    
    html_content = f'''
        <h2>Welcome to AI Home Designer</h2>
        <p>Click the link below to log in:</p>
        <p><a href="{magic_link}">Log In</a></p>
        <p>This link expires in 24 hours.</p>
    '''
    
    # Run in thread to not block
    await asyncio.to_thread(send_email_smtp, email, 'Your AI Home Designer Login Link', html_content)

def get_or_create_user(db: Session, email: str) -> User:
    """Get or create user by email."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        logger.info('Creating new user for email=%s', email)
        user = User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def hash_password(password: str) -> str:
    """Hash password using Argon2.
    
    Argon2 è l'algoritmo vincitore del Password Hashing Competition.
    NON ha limiti di lunghezza password come bcrypt.
    """
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash using Argon2."""
    try:
        return pwd_context.verify(password, password_hash)
    except Exception as e:
        logger.error(f'Password verification failed: {e}')
        return False

def generate_verification_code() -> str:
    """Generate a 4-digit verification code."""
    return ''.join([str(secrets.randbelow(10)) for _ in range(4)])

def send_verification_email_sync(email: str, code: str, first_name: str = None):
    """Send verification code email via Gmail SMTP.
    
    SINCRONA - chiamata come BackgroundTask da FastAPI.
    BackgroundTask gestisce correttamente funzioni sincrone in un thread separato.
    """
    LOG(f'[VERIFY_EMAIL] START email={email} code={code} name={first_name}')
    
    name = first_name or 'User'
    
    html_content = f'''
        <h2>Ciao {name}!</h2>
        <p>Il tuo codice di verifica è:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; color: #2563eb;">{code}</h1>
        <p>Inserisci questo codice per verificare il tuo account.</p>
        <p>Il codice scade tra 10 minuti.</p>
    '''
    
    result = send_email_smtp(email, 'Verifica il tuo account AI Home Designer', html_content)
    LOG(f'[VERIFY_EMAIL] END email={email} success={result}')
    return result


async def send_verification_email(email: str, code: str, first_name: str = None):
    """Send verification code email via Gmail SMTP (async version).
    
    Wrapper async per compatibilità con vecchi chiamanti.
    """
    LOG(f'[VERIFY_EMAIL_ASYNC] Delegating to sync version...')
    return await asyncio.to_thread(send_verification_email_sync, email, code, first_name)
