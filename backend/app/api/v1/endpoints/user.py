# app/api/v1/endpoints/user.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.oauth_model import OAuthUser
from app.schemas.user import UserProfile
from app.core.oauth import oauth2_scheme
from app.core.security import decode_access_token

router = APIRouter()

@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id:int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Fetch authenticated user profile."""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(OAuthUser).filter(OAuthUser.provider_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserProfile(
        id=user.id,
        name=user.name, 
        email=user.email, 
        phone=user.phone,  # Include phone number
        profile_picture=user.profile_picture
    )