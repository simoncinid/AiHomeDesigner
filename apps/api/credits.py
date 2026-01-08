from sqlalchemy.orm import Session
from models import User, CreditTransaction, IPDailyUsage
from datetime import date
from typing import Optional
import uuid

def check_free_quota(db: Session, ip_hash: str) -> tuple[bool, int]:
    """Check if IP has free quota remaining. Returns (has_quota, remaining)."""
    today = date.today()
    usage = db.query(IPDailyUsage).filter(
        IPDailyUsage.ip_hash == ip_hash,
        IPDailyUsage.usage_date == today,
    ).first()
    
    if not usage:
        return True, 1
    
    remaining = max(0, 1 - usage.free_images_used)
    return remaining > 0, remaining

def use_free_quota(db: Session, ip_hash: str) -> bool:
    """Use one free image quota. Returns True if successful."""
    today = date.today()
    usage = db.query(IPDailyUsage).filter(
        IPDailyUsage.ip_hash == ip_hash,
        IPDailyUsage.usage_date == today,
    ).first()
    
    if not usage:
        usage = IPDailyUsage(ip_hash=ip_hash, usage_date=today, free_images_used=0)
        db.add(usage)
    
    if usage.free_images_used >= 1:
        return False
    
    usage.free_images_used += 1
    db.commit()
    return True

def check_user_credits(db: Session, user_id: uuid.UUID, photo_needed: int = 0, video_needed: int = 0) -> bool:
    """Check if user has sufficient credits."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    
    if photo_needed > 0 and user.credits_photo < photo_needed:
        return False
    
    if video_needed > 0 and user.credits_video < video_needed:
        return False
    
    return True

def spend_credits(
    db: Session,
    user_id: uuid.UUID,
    photo_amount: int,
    video_amount: int,
    job_id: Optional[uuid.UUID] = None,
    reason: str = 'Job generation',
) -> bool:
    """Spend credits from user account. Returns True if successful."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    
    if photo_amount > 0 and user.credits_photo < photo_amount:
        return False
    
    if video_amount > 0 and user.credits_video < video_amount:
        return False
    
    user.credits_photo -= photo_amount
    user.credits_video -= video_amount
    
    transaction = CreditTransaction(
        user_id=user_id,
        kind='spend',
        photo_delta=-photo_amount,
        video_delta=-video_amount,
        reason=reason,
        job_id=job_id,
    )
    db.add(transaction)
    db.commit()
    return True

def grant_credits(
    db: Session,
    user_id: uuid.UUID,
    photo_amount: int,
    video_amount: int,
    reason: str,
    stripe_event_id: Optional[str] = None,
) -> bool:
    """Grant credits to user account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    
    user.credits_photo += photo_amount
    user.credits_video += video_amount
    
    transaction = CreditTransaction(
        user_id=user_id,
        kind='grant',
        photo_delta=photo_amount,
        video_delta=video_amount,
        reason=reason,
        stripe_event_id=stripe_event_id,
    )
    db.add(transaction)
    db.commit()
    return True
