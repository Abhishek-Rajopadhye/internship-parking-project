# app/core/oauth.py

import httpx
from fastapi import HTTPException
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_oauth_token(provider: str, code: str) -> dict:
    """Exchange OAuth2 code for an access token."""
    provider_config = {
        "google": {
            "token_url": "https://oauth2.googleapis.com/token",
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        },
        "github":{
            "token_url": "https://github.com/login/oauth/access_token",
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "redirect_uri": settings.GITHUB_REDIRECT_URI,
        }
    }

    if provider not in provider_config:
        raise HTTPException(status_code=400, detail="Unsupported provider")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            provider_config[provider]["token_url"],
            data={
                "client_id": provider_config[provider]["client_id"],
                "client_secret": provider_config[provider]["client_secret"],
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": provider_config[provider]["redirect_uri"],
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        if response.status_code != 200:
            print("Token Exchange Failed:", response.text)  # Debugging
            raise HTTPException(status_code=400, detail="Failed to obtain access token")

        return response.json()

async def get_oauth_user_info(provider: str, access_token: str) -> dict:
    """Fetch user details from OAuth2 provider."""
    provider_config = {
        "google": {
            "token_url": "https://oauth2.googleapis.com/token",
            "auth_url": "https://accounts.google.com/o/oauth2/auth",
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "userinfo_url": "https://www.googleapis.com/oauth2/v2/userinfo",
        },
        "github":{
            "token_url": "https://github.com/login/oauth/access_token",
            "auth_url": "https://github.com/login/oauth/authorize",
            "client_id": settings.GITHUB_CLIENT_ID,
            "userinfo_url": "https://api.github.com/user",
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "redirect_uri": settings.GITHUB_REDIRECT_URI,
        }
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(
            provider_config[provider]["userinfo_url"],
            headers={"Authorization": f"Bearer {access_token}"}
        )

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user info")

        return response.json()