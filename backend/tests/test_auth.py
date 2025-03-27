import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.db.session import get_db
from app.db.oauth_model import OAuthUser
from app.core.oauth import get_oauth_user_info, get_oauth_token

"""
This module contains test cases for OAuth authentication in the FastAPI application.
Test Cases:
1. test_google_oauth_login: Tests the Google OAuth login redirect.
2. test_github_oauth_login: Tests the GitHub OAuth login redirect.
3. test_invalid_provider_login: Tests login with an invalid provider.
4. test_missing_authorization_code: Tests the callback with a missing authorization code.
5. test_google_oauth_callback: Tests the Google OAuth callback with valid data.
6. test_github_oauth_callback: Tests the GitHub OAuth callback with valid data.
7. test_existing_user_login: Tests login for an existing user.
8. test_new_user_login: Tests login for a new user.
9. test_failed_to_obtain_access_token: Tests the callback when failing to obtain an access token.
10. test_failed_to_fetch_user_info: Tests the callback when failing to fetch user info.
Helper Functions:
- create_mock_oauth_user: Creates a mock OAuth user for testing purposes.
Dependencies:
- override_get_db: Overrides the database dependency for testing.
"""

client = TestClient(app)

@pytest.fixture
def db():
    session = Session()
    yield session
    session.close()

# Dependency override for testing
def override_get_db():
    yield Session()

app.dependency_overrides[get_db] = override_get_db

# Helper function to create a mock OAuth user
def create_mock_oauth_user(db: Session, provider: str, provider_id: str, email: str):
    """
    Create a mock OAuth user and add it to the database.

    Parameters:
        db (Session): The database session to use for adding the user.
        provider (str): The OAuth provider (e.g., 'google', 'facebook').
        provider_id (str): The unique identifier for the user from the OAuth provider.
        email (str): The email address of the user.

    Returns:
        OAuthUser: The created OAuth user object.

    Raises:
        SQLAlchemyError: If there is an error committing the user to the database.
    """
    user = OAuthUser(
        provider=provider,
        provider_id=provider_id,
        email=email,
        name="Test User",
        profile_picture="http://example.com/avatar.png",
        access_token="mock_access_token"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Invalid Case 1: Invalid provider for login
def test_invalid_provider_login():
    """
    Test login with an invalid provider.

    Assertions:
        - The response status code is 400 (Bad Request).
        - The response JSON contains the detail "Invalid provider".
    """
    response = client.get("/api/v1/auth/invalid_provider/login")
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid provider"}

# Invalid Case 2: Missing authorization code in callback
def test_missing_authorization_code():
    """
    Test the callback with a missing authorization code.

    Assertions:
        - The response status code is 401 (Unauthorized).
        - The response JSON contains the detail "Authorization code not provided".
    """
    response = client.get("/api/v1/auth/google/callback")
    assert response.status_code == 401
    assert response.json() == {"detail": "Authorization code not provided"}
