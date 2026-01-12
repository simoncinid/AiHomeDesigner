import os
import jwt
from passlib.context import CryptContext
import secrets
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from models import User
import resend
import logging
import asyncio

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv('JWT_SECRET', 'change_me_in_production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24
RESEND_API_KEY = os.getenv('RESEND_API_KEY')
SITE_URL = os.getenv('SITE_URL', 'http://localhost:3000')

resend_client = resend.Resend(api_key=RESEND_API_KEY) if RESEND_API_KEY else None

def create_token(email: str) -> str:
    """Create JWT token for user."""
    payload = {
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get('email')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def send_magic_link(email: str, token: str):
    """Send magic link email via Resend."""
    if not resend_client:
        logger.info('[DEV] Magic link for %s: %s/auth/verify?token=%s', email, SITE_URL, token)
        return
    
    magic_link = f'{SITE_URL}/auth/verify?token={token}'
    
    try:
        resend_client.emails.send({
            'from': 'AI Home Designer <noreply@ai-homedesigner.com>',
            'to': [email],
            'subject': 'Your AI Home Designer Login Link',
            'html': f'''
                <h2>Welcome to AI Home Designer</h2>
                <p>Click the link below to log in:</p>
                <p><a href="{magic_link}">Log In</a></p>
                <p>This link expires in 24 hours.</p>
            ''',
        })
    except Exception:
        logger.exception('Error sending magic link email for %s', email)

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
    """Hash password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(password, password_hash)

def generate_verification_code() -> str:
    """Generate a 4-digit verification code."""
    return ''.join([str(secrets.randbelow(10)) for _ in range(4)])

async def send_verification_email(email: str, code: str, first_name: str = None):
    """Send verification code email via Resend.
    
    Questa funzione NON deve mai bloccare - è chiamata come background task.
    """
    logger.info('Sending verification email to %s', email)
    
    if not resend_client:
        logger.info('[DEV] Verification code for %s: %s (Resend not configured)', email, code)
        return
    
    name = first_name or 'User'
    try:
        payload = {
            'from': 'AI Home Designer <reservationwebbitz@gmail.com>',
            'to': [email],
            'subject': 'Verifica il tuo account AI Home Designer',
            'html': f'''
                <h2>Ciao {name}!</h2>
                <p>Il tuo codice di verifica è:</p>
                <h1 style="font-size: 32px; letter-spacing: 8px; color: #2563eb;">{code}</h1>
                <p>Inserisci questo codice per verificare il tuo account.</p>
                <p>Il codice scade tra 10 minuti.</p>
            ''',
        }
        # Timeout aggressivo per non bloccare mai
        await asyncio.wait_for(
            asyncio.to_thread(resend_client.emails.send, payload),
            timeout=10,
        )
        logger.info('Verification email sent successfully to %s', email)
    except asyncio.TimeoutError:
        logger.error('Timeout sending verification email to %s (Resend took too long)', email)
    except Exception:
        logger.exception('Error sending verification email for %s', email)
