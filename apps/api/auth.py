import os
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

def send_email_smtp(to_email: str, subject: str, html_content: str):
    """Send email via Gmail SMTP.
    
    Requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables.
    """
    logger.info('='*50)
    logger.info('SEND_EMAIL_SMTP called')
    logger.info('  to: %s', to_email)
    logger.info('  subject: %s', subject)
    logger.info('  GMAIL_USER: %s', GMAIL_USER)
    logger.info('  GMAIL_APP_PASSWORD configured: %s', bool(GMAIL_APP_PASSWORD))
    
    if not GMAIL_APP_PASSWORD:
        logger.warning('GMAIL_APP_PASSWORD not configured! Cannot send email.')
        logger.info('='*50)
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f'AI Home Designer <{GMAIL_USER}>'
        msg['To'] = to_email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Connect to Gmail SMTP
        logger.info('Connecting to Gmail SMTP...')
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            logger.info('Logging in to Gmail...')
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            logger.info('Sending email...')
            server.sendmail(GMAIL_USER, to_email, msg.as_string())
        
        logger.info('Email sent successfully to %s', to_email)
        logger.info('='*50)
        return True
        
    except Exception as e:
        logger.exception('ERROR sending email to %s: %s', to_email, str(e))
        logger.info('='*50)
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

async def send_verification_email(email: str, code: str, first_name: str = None):
    """Send verification code email via Gmail SMTP.
    
    Questa funzione NON deve mai bloccare - è chiamata come background task.
    """
    name = first_name or 'User'
    
    html_content = f'''
        <h2>Ciao {name}!</h2>
        <p>Il tuo codice di verifica è:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; color: #2563eb;">{code}</h1>
        <p>Inserisci questo codice per verificare il tuo account.</p>
        <p>Il codice scade tra 10 minuti.</p>
    '''
    
    # Run in thread to not block
    await asyncio.to_thread(send_email_smtp, email, 'Verifica il tuo account AI Home Designer', html_content)
