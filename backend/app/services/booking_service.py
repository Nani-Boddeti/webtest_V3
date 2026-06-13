import datetime
from typing import Optional
from sqlalchemy.orm import Session
from ..models import Booking, Service, BookingStatus, generate_reference_id
from ..config import settings
from .availability_service import check_overlap

def create_booking(
    db: Session,
    customer_name: str,
    service_id: int,
    appointment_start_str: str,
    session_id: Optional[str] = None,
    is_admin_override: bool = False,
    override_reason: Optional[str] = None
) -> dict:
    """Create a new booking with all constraint checks."""
    try:
        appointment_start = datetime.datetime.fromisoformat(appointment_start_str)
    except ValueError:
        return {"success": False, "error": "Invalid date format. Use ISO format."}

    if appointment_start.tzinfo is None:
        appointment_start = appointment_start.replace(tzinfo=datetime.timezone.utc)

    now = datetime.datetime.now(datetime.timezone.utc)

    # Get service
    service = db.query(Service).filter(Service.id == service_id, Service.is_active == True).first()
    if not service:
        return {"success": False, "error": "Service not found or inactive."}

    duration_minutes = service.duration_minutes

    # Admin override bypasses constraint checks
    if not is_admin_override:
        # Check past
        if appointment_start < now:
            return {"success": False, "error": "Cannot book in the past."}

        # Check max advance
        max_advance = now + datetime.timedelta(days=settings.MAX_ADVANCE_DAYS)
        if appointment_start > max_advance:
            return {"success": False, "error": f"Booking cannot be more than {settings.MAX_ADVANCE_DAYS} days in advance."}

        # Check min lead time
        min_lead = now + datetime.timedelta(minutes=settings.MIN_LEAD_TIME_MINUTES)
        if appointment_start < min_lead:
            return {"success": False, "error": f"Booking must be at least {settings.MIN_LEAD_TIME_MINUTES} minutes ahead."}

        # Check overlap
        if check_overlap(db, service_id, appointment_start, duration_minutes):
            return {"success": False, "error": "This time slot overlaps with an existing booking."}

    # If admin override, still check overlap but allow
    has_overlap = check_overlap(db, service_id, appointment_start, duration_minutes)
    if has_overlap and not is_admin_override:
        return {"success": False, "error": "This time slot overlaps with an existing booking."}

    # Create booking
    ref_id = generate_reference_id()
    booking = Booking(
        reference_id=ref_id,
        customer_name=customer_name,
        service_id=service_id,
        appointment_start=appointment_start,
        duration_minutes=duration_minutes,
        status=BookingStatus.CONFIRMED.value,
        session_id=session_id,
        is_admin_override=is_admin_override,
        override_reason=override_reason
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "success": True,
        "booking": {
            "id": booking.id,
            "reference_id": booking.reference_id,
            "customer_name": booking.customer_name,
            "service_id": booking.service_id,
            "service_name": service.name,
            "appointment_start": booking.appointment_start.isoformat(),
            "duration_minutes": booking.duration_minutes,
            "status": booking.status,
            "is_admin_override": booking.is_admin_override,
            "override_reason": booking.override_reason
        }
    }

def cancel_booking(db: Session, reference_id: str) -> dict:
    """Cancel a booking by reference ID."""
    booking = db.query(Booking).filter(Booking.reference_id == reference_id).first()
    if not booking:
        return {"success": False, "error": "Booking not found."}
    if booking.status == BookingStatus.CANCELLED.value:
        return {"success": False, "error": "Booking is already cancelled."}

    booking.status = BookingStatus.CANCELLED.value
    db.commit()
    return {"success": True, "message": f"Booking {reference_id} cancelled."}

def lookup_booking(db: Session, reference_id: str) -> Optional[dict]:
    """Look up a booking by reference ID."""
    booking = db.query(Booking).filter(Booking.reference_id == reference_id).first()
    if not booking:
        return None

    service_name = booking.service.name if booking.service else "Unknown"

    return {
        "id": booking.id,
        "reference_id": booking.reference_id,
        "customer_name": booking.customer_name,
        "service_id": booking.service_id,
        "service_name": service_name,
        "appointment_start": booking.appointment_start.isoformat(),
        "duration_minutes": booking.duration_minutes,
        "status": booking.status,
        "is_admin_override": booking.is_admin_override,
        "override_reason": booking.override_reason
    }
