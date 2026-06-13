import uuid
import datetime
from sqlalchemy import Column, String, Integer, DateTime, Float, Text, Boolean, ForeignKey, Time, Enum as SAEnum
from sqlalchemy.orm import relationship
from .database import Base
import enum

class BookingStatus(str, enum.Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"

def generate_reference_id():
    return uuid.uuid4().hex[:8].upper()

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    duration_minutes = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BusinessHour(Base):
    __tablename__ = "business_hours"
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    open_time = Column(Time, nullable=False)
    close_time = Column(Time, nullable=False)
    is_active = Column(Boolean, default=True)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String(8), unique=True, index=True, default=generate_reference_id)
    customer_name = Column(String(255), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    appointment_start = Column(DateTime, nullable=False, index=True)
    duration_minutes = Column(Integer, nullable=False)
    status = Column(String(20), default=BookingStatus.CONFIRMED.value)
    session_id = Column(String(255), nullable=True)
    is_admin_override = Column(Boolean, default=False)
    override_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    service = relationship("Service")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    consecutive_failures = Column(Integer, default=0)
    is_fallback_mode = Column(Boolean, default=False)
    messages = relationship("ConversationMessage", back_populates="session", order_by="ConversationMessage.timestamp")

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), ForeignKey("chat_sessions.session_id"), nullable=False)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    intent = Column(String(50), nullable=True)
    confidence = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    session = relationship("ChatSession", back_populates="messages")

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
