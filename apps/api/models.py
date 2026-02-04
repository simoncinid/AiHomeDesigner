from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Date, JSON, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base
import uuid

class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)  # bcrypt hash
    email_verified = Column(Boolean, nullable=False, default=False)
    verification_code = Column(String, nullable=True)  # 4-digit code
    verification_code_expires = Column(DateTime(timezone=True), nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    credits_photo = Column(Integer, nullable=False, default=0)
    credits_video = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class IPDailyUsage(Base):
    __tablename__ = 'ip_daily_usage'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ip_hash = Column(String, nullable=False, index=True)
    usage_date = Column(Date, nullable=False)
    free_images_used = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        UniqueConstraint('ip_hash', 'usage_date', name='uq_ip_daily_usage_ip_hash_date'),
    )

class Job(Base):
    __tablename__ = 'jobs'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    share_id = Column(String, unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    ip_hash = Column(String, nullable=True, index=True)
    kind = Column(String, nullable=False)  # 't2i' | 'edit' | 'i2v'
    status = Column(String, nullable=False, default='created')  # 'created' | 'processing' | 'completed' | 'failed'
    wavespeed_request_id = Column(String, nullable=True)
    room_type = Column(String, nullable=True)
    style_preset = Column(String, nullable=True)
    prompt = Column(Text, nullable=False)
    input_urls = Column(JSON, nullable=True)
    output_urls = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    is_public = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class CreditTransaction(Base):
    __tablename__ = 'credit_transactions'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    kind = Column(String, nullable=False)  # 'grant' | 'spend' | 'refund'
    photo_delta = Column(Integer, nullable=False, default=0)
    video_delta = Column(Integer, nullable=False, default=0)
    reason = Column(String, nullable=False)
    stripe_event_id = Column(String, nullable=True, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey('jobs.id'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FreeGenerationLead(Base):
    __tablename__ = 'free_generation_leads'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    language = Column(String, nullable=False)
    ip_hash = Column(String, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
