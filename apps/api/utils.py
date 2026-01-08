import hashlib
import os
from typing import Optional
from fastapi import Request
import secrets
import string

IP_SALT = os.getenv('IP_SALT', 'default_salt_change_in_production')

def get_client_ip(request: Request) -> str:
    """Extract client IP from request headers."""
    forwarded = request.headers.get('x-forwarded-for')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.client.host if request.client else 'unknown'

def hash_ip(ip: str) -> str:
    """Hash IP address with salt."""
    return hashlib.sha256(f'{ip}{IP_SALT}'.encode()).hexdigest()

def generate_share_id() -> str:
    """Generate a short share ID for public links."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(12))

def validate_prompt(prompt: str, max_length: int = 600) -> tuple[bool, Optional[str]]:
    """Validate prompt length and content."""
    if len(prompt) > max_length:
        return False, f'Prompt too long (max {max_length} characters)'
    
    # Basic content filtering
    disallowed = ['nude', 'naked', 'explicit', 'nsfw']  # Add more as needed
    prompt_lower = prompt.lower()
    for word in disallowed:
        if word in prompt_lower:
            return False, 'Prompt contains disallowed content'
    
    return True, None
