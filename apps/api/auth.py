import os
import jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from models import User
import resend

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
        print(f'[DEV] Magic link for {email}: {SITE_URL}/auth/verify?token={token}')
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
    except Exception as e:
        print(f'Error sending magic link: {e}')

def get_or_create_user(db: Session, email: str) -> User:
    """Get or create user by email."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
