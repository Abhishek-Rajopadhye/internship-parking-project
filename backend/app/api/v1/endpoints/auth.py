# app/api/v1/endpoints/auth.py

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse
from app.core.oauth import get_oauth_token, get_oauth_user_info
from app.db.session import get_db
from app.db.auth_crud import create_oauth_user
from app.core.config import settings

router = APIRouter()

@router.get("/{provider}/login")
async def login(provider: str):
    """Redirect user to OAuth provider login page."""
    if provider not in ["google", "github"]:
        return {"error": "Invalid provider"}

    config = settings.dict()
    auth_url = (
        f"{config[f'{provider.upper()}_AUTH_URL']}?client_id={config[f'{provider.upper()}_CLIENT_ID']}"
        f"&redirect_uri={config[f'{provider.upper()}_REDIRECT_URI']}&response_type=code&scope=openid email profile"
    )

    return RedirectResponse(auth_url)

@router.get("/{provider}/callback")
async def callback(provider: str, request: Request, db: Session = Depends(get_db)):
    """Handle OAuth2 callback."""
    code = request.query_params.get("code")
    if not code:
        return {"error": "Authorization code not provided"}

    # Exchange code for token
    token_data = await get_oauth_token(provider, code)
    access_token = token_data.get("access_token")

    # Get user info
    user_info = await get_oauth_user_info(provider, access_token)

    user_data = {
        "provider": provider,
        "provider_id": str(user_info.get("id")),
        "email": user_info.get("email"),
        "name": user_info.get("name"),
        "profile_picture": user_info.get("avatar_url") if provider == "github" else user_info.get("picture"),
        "access_token": access_token
    }

    # Save user in the database
    user = create_oauth_user(db, user_data)
    return RedirectResponse(f"http://localhost:5173/dashboard?token={access_token}&user_id={user_data['provider_id']}")