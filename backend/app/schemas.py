from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    duration_minutes: int = 60

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    is_active: Optional[bool] = None

class ServiceResponse(BaseModel):
    id: int
    name: str
    description: str
    duration_minutes: int
    is_active: bool

class BusinessHourCreate(BaseModel):
    day_of_week: int
    open_time: str  # HH:MM
    close_time: str  # HH:MM

class BusinessHourResponse(BaseModel):
    id: int
    day_of_week: int
    open_time: str
    close_time: str
    is_active: bool

class BookingCreate(BaseModel):
    customer_name: str
    service_id: int
    appointment_start: str  # ISO datetime
    session_id: Optional[str] = None

class AdminBookingCreate(BaseModel):
    customer_name: str
    service_id: int
    appointment_start: str
    is_override: bool = False
    override_reason: Optional[str] = None

class BookingUpdate(BaseModel):
    appointment_start: Optional[str] = None
    status: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    reference_id: str
    customer_name: str
    service_id: int
    service_name: Optional[str] = None
    appointment_start: str
    duration_minutes: int
    status: str
    is_admin_override: bool
    override_reason: Optional[str]

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    reply: str
    intent: Optional[str] = None
    confidence: Optional[float] = None
    booking: Optional[BookingResponse] = None
    is_fallback: bool = False

class SlotResponse(BaseModel):
    start: str
    end: str
    available: bool

class AnalyticsResponse(BaseModel):
    date: str
    count: int

class ConversationLogResponse(BaseModel):
    session_id: str
    messages: List[dict]
    created_at: str
