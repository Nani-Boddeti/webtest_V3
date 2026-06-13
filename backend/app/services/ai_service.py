import json
import datetime
import re
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from ..models import ChatSession, ConversationMessage
from ..config import settings

# --- Intent extraction (rule-based) ---
# Order matters: cancel/reschedule checked BEFORE booking to avoid false matches

INTENT_PATTERNS = {
    "cancel": [
        r"\b(cancel|cancelled|cancellation)\b",
        r"\b(delete|remove|unbook|void|call off)\b",
        r"\b(need to cancel|want to cancel|i'd like to cancel|i have to cancel)\b",
        r"\b(can (I|you) cancel|please cancel)\b",
        r"\b(cancel (my|the|this))\b",
    ],
    "reschedule": [
        r"\b(reschedule|rescheduling)\b",
        r"\b(move)\b",
        r"\b(rearrange)\b",
        r"\b(change (my )?(appointment|booking|time|date|day))\b",
        r"\b(different time|different day|different date)\b",
        r"\b(need to (reschedule|move|change|rearrange))\b",
        r"\b(want to (reschedule|move|change|rearrange))\b",
        r"\b(can (I|we) (reschedule|move|change))\b",
        r"\b(i'd like to (reschedule|move|change))\b",
    ],
    "booking": [
        r"\b(book|schedule|reserve|reservation)\b",
        r"\b(booking)\b",
        r"\b(want to (come|see))\b",
        r"\b(i'd like to (book|schedule|make|come|reserve))\b",
        r"\b(can I (book|schedule|get|come|make))\b",
        r"\b(can you book|can you schedule)\b",
        r"\b(make (a|an|me) (booking|appointment|reservation))\b",
        r"\b(i need (a|an|to) (book|schedule|appointment|reservation|make|get))\b",
        r"\b(i want (a|an|to) (book|schedule|appointment|reservation|make|get))\b",
        r"\b(i'd like (a|an))",
        r"\b(need to (book|schedule|make|get))\b",
        r"\b(want to (book|schedule|make|get|reserve))\b",
        r"\b(get (a|an|my) (haircut|massage|facial|manicure|pedicure|consultation|hair.?cut))\b",
        r"\b(come in for)\b",
        r"\b(i want (a|an) (haircut|massage|facial|manicure|pedicure|consultation))\b",
        r"\b(i need (a|an) (haircut|massage|facial|manicure|pedicure|consultation))\b",
        r"\b(i'd like (a|an) (haircut|massage|facial|manicure|pedicure|consultation))\b",
    ],
    "availability": [
        r"\b(available|availability)\b",
        r"\bfree\b",
        r"\b(free.?slot|open.?slot|slot.?open|slot.?free)\b",
        r"\b(when can|what times|any openings|openings)\b",
        r"\b(do you have|is there (any|an)|are there)\b",
        r"\b(what (time|slots|appointments) (is|are|do))\b",
        r"\b(show me|tell me|check|see)\b.*\b(available|free|open|slot|schedule)\b",
        r"\b(i want to check|i need to check|can (i|you) check)\b",
    ],
    "greeting": [
        r"\b(hi|hello|hey|howdy)\b",
        r"\b(good morning|good afternoon|good evening)\b",
        r"\b(hi there|hello there|hey there)\b",
        r"\b(what's up|how are you|how's it going|how are you doing)\b",
        r"\b(greetings|good day|nice to meet you)\b",
        r"\b(yo)\b",
    ],
    "help": [
        r"\b(help|support|instructions)\b",
        r"\b(what can you do|what do you do|how (does this|do i|can i))\b",
        r"\b(how (to|do|does|can))\b",
        r"\b(tell me|show me|guide me)\b",
        r"\b(need help|need assistance)\b",
        r"\b(i don't know how|not sure how|don't understand)\b",
        r"\b(i need (help|assistance))\b",
        r"\b(what (services|options) do you)\b",
    ],
}

FALLBACK_REPLIES = [
    "I'm sorry, I'm having trouble understanding. Could you rephrase that?",
    "I didn't quite catch that. You can ask me to book, cancel, or check availability.",
    "Let me try again — would you like to book an appointment, check available slots, or cancel a booking?",
    "I'm here to help with bookings! Try something like 'I'd like to book a haircut' or 'What times are available tomorrow?'",
    "Sorry, I didn't understand that. For booking, just say something like 'Book a service for me.'",
]

SERVICE_KEYWORDS = {
    "haircut": 1,
    "hair cut": 1,
    "hair": 1,
    "massage": 2,
    "facial": 3,
    "manicure": 4,
    "pedicure": 5,
    "consultation": 6,
}

def extract_intent(message: str) -> Tuple[str, float, dict]:
    """Extract intent from message using pattern matching."""
    message_lower = message.lower().strip()
    msg = message_lower

    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            match = re.search(pattern, msg)
            if match:
                # For booking patterns using generic terms, exclude if message is about cancel/reschedule
                if intent == 'booking':
                    if re.search(r'\b(cancel|reschedule|delete|remove|void|unbook)\b', msg):
                        continue

                matched_text = match.group(0)
                confidence = min(0.95, 0.7 + len(matched_text.split()) * 0.05)

                entities = _extract_entities(msg, intent)

                return intent, round(confidence, 2), entities

    # Fallback checks
    if re.search(r'\b(cancel|delete|remove|void|unbook)\b', msg):
        return "cancel", 0.5, {}

    if re.search(r'\b(move|reschedule|rearrange)\b', msg) and \
       re.search(r'\b(appointment|booking|time|date|day)\b', msg):
        return "reschedule", 0.5, {}

    if len(msg.split()) <= 3:
        return "greeting", 0.6, {}

    return "unknown", 0.3, {}

def _extract_entities(message: str, intent: str) -> dict:
    """Extract entities like service name, date from message."""
    entities = {}

    # Extract service
    for keyword, service_id in SERVICE_KEYWORDS.items():
        if keyword in message:
            entities["service_id"] = service_id
            entities["service_name"] = keyword.title()
            break

    # Extract date references
    today = datetime.date.today()

    if "tomorrow" in message:
        entities["date"] = (today + datetime.timedelta(days=1)).isoformat()
    elif "day after tomorrow" in message:
        entities["date"] = (today + datetime.timedelta(days=2)).isoformat()
    elif "next week" in message:
        entities["date"] = (today + datetime.timedelta(days=7 - today.weekday())).isoformat()
    elif "next monday" in message:
        days_ahead = (7 - today.weekday() + 0) % 7 or 7
        entities["date"] = (today + datetime.timedelta(days=days_ahead)).isoformat()
    elif "next tuesday" in message:
        days_ahead = (7 - today.weekday() + 1) % 7 or 7
        entities["date"] = (today + datetime.timedelta(days=days_ahead)).isoformat()
    elif "next wednesday" in message:
        days_ahead = (7 - today.weekday() + 2) % 7 or 7
        entities["date"] = (today + datetime.timedelta(days=days_ahead)).isoformat()
    elif "next thursday" in message:
        days_ahead = (7 - today.weekday() + 3) % 7 or 7
        entities["date"] = (today + datetime.timedelta(days=days_ahead)).isoformat()
    elif "next friday" in message:
        days_ahead = (7 - today.weekday() + 4) % 7 or 7
        entities["date"] = (today + datetime.timedelta(days=days_ahead)).isoformat()
    elif "today" in message:
        entities["date"] = today.isoformat()
    else:
        date_match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', message)
        if date_match:
            entities["date"] = date_match.group(1)

    return entities

def process_chat_message(db: Session, session_id: str, message: str, services: list) -> dict:
    """Process a chat message, extract intent, and generate response."""
    session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    if not session:
        session = ChatSession(
            session_id=session_id,
            created_at=datetime.datetime.utcnow(),
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            consecutive_failures=0,
            is_fallback_mode=False
        )
        db.add(session)
        db.commit()
        db.refresh(session)

    user_msg = ConversationMessage(
        session_id=session_id,
        role="user",
        content=message
    )
    db.add(user_msg)

    intent, confidence, entities = extract_intent(message)

    is_fallback = False
    if confidence < settings.AI_CONFIDENCE_THRESHOLD:
        session.consecutive_failures += 1
        if session.consecutive_failures >= settings.AI_FALLBACK_THRESHOLD:
            session.is_fallback_mode = True
            is_fallback = True
        db.commit()
    else:
        session.consecutive_failures = 0
        session.is_fallback_mode = False
        db.commit()

    response = _generate_response(intent, confidence, entities, services, is_fallback)

    ai_msg = ConversationMessage(
        session_id=session_id,
        role="assistant",
        content=response["reply"],
        intent=intent,
        confidence=confidence
    )
    db.add(ai_msg)
    db.commit()

    return {
        "reply": response["reply"],
        "intent": intent,
        "confidence": confidence,
        "booking": response.get("booking"),
        "is_fallback": is_fallback
    }

def _generate_response(intent: str, confidence: float, entities: dict, services: list, is_fallback: bool) -> dict:
    """Generate a response based on intent and entities."""
    if is_fallback:
        return {"reply": FALLBACK_REPLIES[hash(str(entities)) % len(FALLBACK_REPLIES)]}

    if intent == "greeting":
        return {"reply": "Hello! I'm your booking assistant. How can I help you today? You can ask me to book a service, check availability, or manage an existing booking."}

    if intent == "help":
        return {"reply": "I can help you with:\n🔹 Booking a new appointment\n🔹 Checking available time slots\n🔹 Canceling an existing booking\n🔹 Looking up your booking details\n\nJust tell me what you need!"}

    if intent == "availability":
        service_name = entities.get("service_name", "a service")
        date_str = entities.get("date", "today")
        return {"reply": f"Let me check available slots for {service_name} on {date_str}. Please give me a moment while I look up the schedule."}

    if intent == "booking":
        service_name = entities.get("service_name", "a service")
        date_str = entities.get("date", "soon")
        if entities.get("service_id"):
            return {"reply": f"I'd be happy to help you book {service_name}! Let me check availability and we'll get you scheduled.", "needs_confirmation": True}
        else:
            svc_list = "\n".join([f"🔹 {s['name']} ({s['duration_minutes']} min)" for s in services])
            return {"reply": f"Sure! Which service would you like to book?\n\n{svc_list}"}

    if intent == "cancel":
        return {"reply": "I can help you cancel a booking. Please provide your booking reference ID so I can look it up."}

    if intent == "reschedule":
        return {"reply": "I can help you reschedule. First, please provide your booking reference ID so I can find your appointment."}

    return {"reply": "I'm not sure I understood that. Could you rephrase? You can ask to book, check availability, or cancel an appointment."}
