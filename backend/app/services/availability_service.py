import datetime
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from ..models import Booking, BusinessHour, Service, BookingStatus
from ..config import settings

def get_available_slots(
    db: Session,
    date_str: str,
    service_id: int,
    slot_duration: int = 30
) -> List[dict]:
    """Compute available 30-min slots for a given date and service."""
    try:
        target_date = datetime.date.fromisoformat(date_str)
    except ValueError:
        return []

    now = datetime.datetime.now(datetime.timezone.utc)

    # Check max advance
    max_advance = datetime.date.today() + datetime.timedelta(days=settings.MAX_ADVANCE_DAYS)
    if target_date > max_advance:
        return []

    # Check not in past (allow today)
    if target_date < datetime.date.today():
        return []

    # Get business hours for this day
    day_of_week = target_date.weekday()
    hours = db.query(BusinessHour).filter(
        BusinessHour.day_of_week == day_of_week,
        BusinessHour.is_active == True
    ).first()

    if not hours:
        return []

    # Get service duration
    service = db.query(Service).filter(Service.id == service_id, Service.is_active == True).first()
    if not service:
        return []

    # Get existing bookings for this date and service
    day_start = datetime.datetime.combine(target_date, datetime.time.min, tzinfo=datetime.timezone.utc)
    day_end = datetime.datetime.combine(target_date, datetime.time.max, tzinfo=datetime.timezone.utc)

    bookings = db.query(Booking).filter(
        Booking.service_id == service_id,
        Booking.appointment_start >= day_start,
        Booking.appointment_start <= day_end,
        Booking.status == BookingStatus.CONFIRMED.value
    ).all()

    # Build booked intervals
    booked_intervals = []
    for b in bookings:
        b_start = b.appointment_start
        if b_start.tzinfo is None:
            b_start = b_start.replace(tzinfo=datetime.timezone.utc)
        b_end = b_start + datetime.timedelta(minutes=b.duration_minutes)
        booked_intervals.append((b_start, b_end))

    # Generate slots
    open_time = hours.open_time
    close_time = hours.close_time

    slots = []
    current = datetime.datetime.combine(target_date, open_time, tzinfo=datetime.timezone.utc)
    end_boundary = datetime.datetime.combine(target_date, close_time, tzinfo=datetime.timezone.utc)

    while current + datetime.timedelta(minutes=slot_duration) <= end_boundary:
        slot_end = current + datetime.timedelta(minutes=slot_duration)

        # Check lead time
        if current < now + datetime.timedelta(minutes=settings.MIN_LEAD_TIME_MINUTES):
            current += datetime.timedelta(minutes=slot_duration)
            continue

        # Check overlap with bookings
        is_available = True
        for b_start, b_end in booked_intervals:
            if current < b_end and slot_end > b_start:
                is_available = False
                break

        slots.append({
            "start": current.isoformat(),
            "end": slot_end.isoformat(),
            "available": is_available
        })

        current += datetime.timedelta(minutes=slot_duration)

    return slots

def check_overlap(
    db: Session,
    service_id: int,
    appointment_start: datetime.datetime,
    duration_minutes: int,
    exclude_booking_id: Optional[int] = None
) -> bool:
    """Check if a booking overlaps with existing ones. Returns True if overlap exists."""
    start = appointment_start
    if start.tzinfo is None:
        start = start.replace(tzinfo=datetime.timezone.utc)
    end = start + datetime.timedelta(minutes=duration_minutes)

    # Fetch candidate bookings within a reasonable window
    buffer_start = start - datetime.timedelta(hours=2)
    buffer_end = end + datetime.timedelta(hours=2)

    candidates = db.query(Booking).filter(
        Booking.service_id == service_id,
        Booking.appointment_start >= buffer_start,
        Booking.appointment_start <= buffer_end,
        Booking.status == BookingStatus.CONFIRMED.value
    ).all()

    if exclude_booking_id:
        candidates = [c for c in candidates if c.id != exclude_booking_id]

    for b in candidates:
        b_start = b.appointment_start
        if b_start.tzinfo is None:
            b_start = b_start.replace(tzinfo=datetime.timezone.utc)
        b_end = b_start + datetime.timedelta(minutes=b.duration_minutes)
        if start < b_end and end > b_start:
            return True

    return False
