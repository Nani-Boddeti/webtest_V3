from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import datetime

from ..database import get_db
from ..models import Booking, Service, BusinessHour, ConversationMessage, ChatSession, BookingStatus
from ..schemas import (
    AdminBookingCreate, BookingUpdate, BookingResponse,
    ServiceCreate, ServiceUpdate, ServiceResponse,
    BusinessHourCreate, BusinessHourResponse,
    AnalyticsResponse, ConversationLogResponse
)
from ..services.booking_service import create_booking
from ..middleware.auth import verify_admin

router = APIRouter(dependencies=[Depends(verify_admin)])

# --- Service Management ---

@router.post("/services", response_model=ServiceResponse)
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):
    service = Service(
        name=data.name,
        description=data.description or "",
        duration_minutes=data.duration_minutes
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return ServiceResponse(
        id=service.id,
        name=service.name,
        description=service.description or "",
        duration_minutes=service.duration_minutes,
        is_active=service.is_active
    )

@router.put("/services/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, data: ServiceUpdate, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    if data.name is not None:
        service.name = data.name
    if data.description is not None:
        service.description = data.description
    if data.duration_minutes is not None:
        service.duration_minutes = data.duration_minutes
    if data.is_active is not None:
        service.is_active = data.is_active

    db.commit()
    db.refresh(service)
    return ServiceResponse(
        id=service.id,
        name=service.name,
        description=service.description or "",
        duration_minutes=service.duration_minutes,
        is_active=service.is_active
    )

# --- Business Hours ---

@router.post("/business-hours", response_model=BusinessHourResponse)
def set_business_hours(data: BusinessHourCreate, db: Session = Depends(get_db)):
    existing = db.query(BusinessHour).filter(
        BusinessHour.day_of_week == data.day_of_week
    ).first()

    open_time = datetime.time.fromisoformat(data.open_time)
    close_time = datetime.time.fromisoformat(data.close_time)

    if existing:
        existing.open_time = open_time
        existing.close_time = close_time
        existing.is_active = True
        db.commit()
        db.refresh(existing)
        result = existing
    else:
        bh = BusinessHour(
            day_of_week=data.day_of_week,
            open_time=open_time,
            close_time=close_time
        )
        db.add(bh)
        db.commit()
        db.refresh(bh)
        result = bh

    return BusinessHourResponse(
        id=result.id,
        day_of_week=result.day_of_week,
        open_time=result.open_time.strftime("%H:%M"),
        close_time=result.close_time.strftime("%H:%M"),
        is_active=result.is_active
    )

# --- Admin Bookings ---

@router.get("/bookings", response_model=list[BookingResponse])
def list_all_bookings(
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Booking)

    if status:
        query = query.filter(Booking.status == status)
    if date_from:
        try:
            dt_from = datetime.datetime.fromisoformat(date_from)
            if dt_from.tzinfo is None:
                dt_from = dt_from.replace(tzinfo=datetime.timezone.utc)
            query = query.filter(Booking.appointment_start >= dt_from)
        except ValueError:
            pass
    if date_to:
        try:
            dt_to = datetime.datetime.fromisoformat(date_to)
            if dt_to.tzinfo is None:
                dt_to = dt_to.replace(tzinfo=datetime.timezone.utc)
            query = query.filter(Booking.appointment_start <= dt_to)
        except ValueError:
            pass

    query = query.order_by(Booking.appointment_start.desc()).limit(100)
    bookings = query.all()

    result = []
    for b in bookings:
        service_name = b.service.name if b.service else "Unknown"
        result.append(BookingResponse(
            id=b.id,
            reference_id=b.reference_id,
            customer_name=b.customer_name,
            service_id=b.service_id,
            service_name=service_name,
            appointment_start=b.appointment_start.isoformat(),
            duration_minutes=b.duration_minutes,
            status=b.status,
            is_admin_override=b.is_admin_override,
            override_reason=b.override_reason
        ))
    return result

@router.post("/bookings", response_model=BookingResponse)
def admin_create_booking(data: AdminBookingCreate, db: Session = Depends(get_db)):
    result = create_booking(
        db=db,
        customer_name=data.customer_name,
        service_id=data.service_id,
        appointment_start_str=data.appointment_start,
        is_admin_override=data.is_override,
        override_reason=data.override_reason
    )
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["booking"]

@router.put("/bookings/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: int, data: BookingUpdate, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if data.appointment_start:
        try:
            new_start = datetime.datetime.fromisoformat(data.appointment_start)
            if new_start.tzinfo is None:
                new_start = new_start.replace(tzinfo=datetime.timezone.utc)
            booking.appointment_start = new_start
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")

    if data.status:
        if data.status not in [s.value for s in BookingStatus]:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {[s.value for s in BookingStatus]}")
        booking.status = data.status

    db.commit()
    db.refresh(booking)

    service_name = booking.service.name if booking.service else "Unknown"
    return BookingResponse(
        id=booking.id,
        reference_id=booking.reference_id,
        customer_name=booking.customer_name,
        service_id=booking.service_id,
        service_name=service_name,
        appointment_start=booking.appointment_start.isoformat(),
        duration_minutes=booking.duration_minutes,
        status=booking.status,
        is_admin_override=booking.is_admin_override,
        override_reason=booking.override_reason
    )

# --- Analytics ---

@router.get("/analytics", response_model=list[AnalyticsResponse])
def get_analytics(
    date_from: str = Query(...),
    date_to: str = Query(...),
    service_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(
        db.query(Booking.appointment_start).subquery().c.appointment_start
    )
    # We'll do it manually
    try:
        dt_from = datetime.datetime.fromisoformat(date_from)
        dt_to = datetime.datetime.fromisoformat(date_to)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format.")

    if dt_from.tzinfo is None:
        dt_from = dt_from.replace(tzinfo=datetime.timezone.utc)
    if dt_to.tzinfo is None:
        dt_to = dt_to.replace(tzinfo=datetime.timezone.utc)

    bookings_query = db.query(Booking).filter(
        Booking.appointment_start >= dt_from,
        Booking.appointment_start <= dt_to
    )

    if service_id:
        bookings_query = bookings_query.filter(Booking.service_id == service_id)

    bookings = bookings_query.all()

    # Aggregate by date
    daily_counts = {}
    for b in bookings:
        date_key = b.appointment_start.strftime("%Y-%m-%d")
        daily_counts[date_key] = daily_counts.get(date_key, 0) + 1

    result = []
    current = dt_from
    while current <= dt_to:
        date_key = current.strftime("%Y-%m-%d")
        result.append(AnalyticsResponse(
            date=date_key,
            count=daily_counts.get(date_key, 0)
        ))
        current += datetime.timedelta(days=1)

    return result

# --- Conversation Logs ---

@router.get("/conversation-logs", response_model=list[ConversationLogResponse])
def get_conversation_logs(
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    sessions = db.query(ChatSession).order_by(ChatSession.created_at.desc()).limit(limit).all()
    result = []
    for s in sessions:
        messages = []
        for m in s.messages:
            messages.append({
                "role": m.role,
                "content": m.content,
                "intent": m.intent,
                "confidence": m.confidence,
                "timestamp": m.timestamp.isoformat() if m.timestamp else None
            })
        result.append(ConversationLogResponse(
            session_id=s.session_id,
            messages=messages,
            created_at=s.created_at.isoformat() if s.created_at else ""
        ))
    return result
