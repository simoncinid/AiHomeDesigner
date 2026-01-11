from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID

class HealthResponse(BaseModel):
    status: str

class PricingPack(BaseModel):
    id: str
    name: str
    credits: int
    price: float
    price_id: str

class PricingResponse(BaseModel):
    photo_packs: List[PricingPack]
    video_packs: List[PricingPack]

class FreeQuotaResponse(BaseModel):
    remaining: int
    total: int = 1

class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkResponse(BaseModel):
    message: str

class T2IRequest(BaseModel):
    room_type: str
    style_preset: str
    user_prompt: Optional[str] = None
    size: str = '2048*2048'

class EditRequest(BaseModel):
    room_type: str
    style_preset: str
    edit_intent: Optional[str] = None
    size: str = '2048*2048'
    image_url: Optional[str] = None  # If provided, skip upload

class I2VRequest(BaseModel):
    motion_preset: str
    prompt: str
    duration: int = 5
    resolution: str = '720p'
    image_url: Optional[str] = None

class JobResponse(BaseModel):
    id: UUID
    share_id: str
    status: str
    kind: str
    output_urls: Optional[List[str]] = None
    error: Optional[str] = None
    share_url: str

class CreateCheckoutRequest(BaseModel):
    pack_id: str

class CreateCheckoutResponse(BaseModel):
    url: str

class MakePublicResponse(BaseModel):
    share_url: str
    message: str

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class RegisterResponse(BaseModel):
    message: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

class VerifyCodeResponse(BaseModel):
    token: str
    user: dict

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    credits_photo: int
    credits_video: int
    email_verified: bool
