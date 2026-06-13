import base64
import hashlib
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from ..config import settings

security = HTTPBasic()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials using basic auth."""
    if not settings.ADMIN_PASSWORD_HASH:
        # Dev mode - allow any password with admin username
        if credentials.username != "admin":
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return credentials.username

    # In production, use bcrypt verify
    if credentials.username == "admin":
        # Simple hash comparison for MVP
        input_hash = hashlib.sha256(credentials.password.encode()).hexdigest()
        if input_hash == settings.ADMIN_PASSWORD_HASH:
            return credentials.username

    raise HTTPException(status_code=401, detail="Invalid credentials")
