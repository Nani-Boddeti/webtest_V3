from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import datetime

from ..database import get_db
from ..models import Service, BusinessHour
from ..schemas import (
    BookingCreate, BookingResponse, ChatRequest, ChatResponse,
    SlotResponse, ServiceResponse, BusinessHourResponse
)
from ..services.booking_service import create_booking, cancel_booking, lookup_booking
from ..services.availability_service import get_available_slots
from ..services.ai_service import process_chat_message

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}

@router.get("/services", response_model=list[ServiceResponse])
def list_services(db: Session = Depends(get_db)):
    services = db.query(Service).filter(Service.is_active == True).all()
    return [
        ServiceResponse(
            id=s.id,
            name=s.name,
            description=s.description or "",
            duration_minutes=s.duration_minutes,
            is_active=s.is_active
        )
        for s in services
    ]

@router.post("/bookings")
def create_booking_endpoint(data: BookingCreate, db: Session = Depends(get_db)):
    result = create_booking(
        db=db,
        customer_name=data.customer_name,
        service_id=data.service_id,
        appointment_start_str=data.appointment_start,
        session_id=data.session_id
    )
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["booking"]

@router.get("/bookings/lookup")
def lookup_booking_endpoint(reference_id: str = Query(...), db: Session = Depends(get_db)):
    booking = lookup_booking(db, reference_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.post("/bookings/{reference_id}/cancel")
def cancel_booking_endpoint(reference_id: str, db: Session = Depends(get_db)):
    result = cancel_booking(db, reference_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/available-slots")
def available_slots(
    date: str = Query(...),
    service_id: int = Query(...),
    db: Session = Depends(get_db)
):
    slots = get_available_slots(db, date, service_id)
    return {"date": date, "service_id": service_id, "slots": slots}

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(data: ChatRequest, db: Session = Depends(get_db)):
    services = db.query(Service).filter(Service.is_active == True).all()
    services_list = [
        {"id": s.id, "name": s.name, "duration_minutes": s.duration_minutes}
        for s in services
    ]
    result = process_chat_message(db, data.session_id, data.message, services_list)
    return ChatResponse(**result)

@router.get("/business-hours", response_model=list[BusinessHourResponse])
def list_business_hours(db: Session = Depends(get_db)):
    hours = db.query(BusinessHour).filter(BusinessHour.is_active == True).order_by(BusinessHour.day_of_week).all()
    return [
        BusinessHourResponse(
            id=h.id,
            day_of_week=h.day_of_week,
            open_time=h.open_time.strftime("%H:%M"),
            close_time=h.close_time.strftime("%H:%M"),
            is_active=h.is_active
        )
        for h in hours
    ]
