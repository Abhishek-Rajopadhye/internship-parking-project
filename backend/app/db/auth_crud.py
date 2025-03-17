# app/db/crud.py

from sqlalchemy.orm import Session
from app.db.models import OAuthUser

def get_user_by_provider_id(db: Session, provider: str, provider_id: str):
    """Fetch a user by provider and provider ID."""
    return db.query(OAuthUser).filter(OAuthUser.provider == provider, OAuthUser.provider_id == provider_id).first()

def create_oauth_user(db: Session, user_data: dict):
    """Create a new OAuth user or update an existing one."""
    user = get_user_by_provider_id(db, user_data["provider"], user_data["provider_id"])
    
    if user:
        user.access_token = user_data["access_token"]
        db.commit()
        return user

    new_user = OAuthUser(**user_data)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
