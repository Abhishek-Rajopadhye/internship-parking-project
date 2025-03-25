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

# Test Case 1: Valid Google OAuth login redirect
def test_google_oauth_login():
    """
    Test the Google OAuth login redirect.

    Assertions:
        - The response status code is 307 (Temporary Redirect).
        - The response location header contains the Google OAuth URL.
    """
    response = client.get("/api/v1/auth/google/login")
    assert response.status_code == 307
    assert "https://accounts.google.com/o/oauth2/auth" in response.headers["location"]

# Test Case 2: Valid GitHub OAuth login redirect
def test_github_oauth_login():
    """
    Test the GitHub OAuth login redirect.

    Assertions:
        - The response status code is 307 (Temporary Redirect).
        - The response location header contains the GitHub OAuth URL.
    """
    response = client.get("/api/v1/auth/github/login")
    assert response.status_code == 307
    assert "https://github.com/login/oauth/authorize" in response.headers["location"]

# Invalid Case 1: Invalid provider for login
def test_invalid_provider_login():
    """
    Test login with an invalid provider.

    Assertions:
        - The response status code is 400 (Bad Request).
        - The response JSON contains the detail "Invalid provider".
    """
    response = client.get("/invalid_provider/login")
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

# Average Case 1: Valid Google OAuth callback
@pytest.mark.usefixtures("db")
def test_google_oauth_callback():
    """
    Test the Google OAuth callback with valid data.

    Parameters:
        db (Session): The mock database session

    Assertions:
        - The response status code is 307 (Temporary Redirect).
        - The response location header contains the redirect URL with the token and user ID.
    """
    # Mock the OAuth token and user info responses
    app.dependency_overrides[get_oauth_token] = lambda provider, code: {"access_token": "mock_access_token"}
    app.dependency_overrides[get_oauth_user_info] = lambda provider, token: {
        "id": "12345",
        "email": "test@example.com",
        "name": "Test User",
        "picture": "http://example.com/avatar.png"
    }

    response = client.get("/api/v1/auth/google/callback?code=mock_code")
    assert response.status_code == 307
    assert "http://localhost:5173/auth?token=mock_access_token&user_id=12345" in response.headers["location"]

@pytest.mark.usefixtures("db")
def test_github_oauth_callback(db: Session):
    """
    Test the GitHub OAuth callback with valid data.
    
    Parameters:
        db (Session): The mock database session

    Assertions:
        - The response status code is 307 (Temporary Redirect).
        - The response location header contains the redirect URL with the token and user ID.
    """
    # Mock the OAuth token and user info responses
    app.dependency_overrides[get_oauth_token] = lambda provider, code: {"access_token": "mock_access_token"}
    app.dependency_overrides[get_oauth_user_info] = lambda provider, token: {
        "id": "12345",
        "email": "test@example.com",
        "name": "Test User",
        "avatar_url": "http://example.com/avatar.png"
    }

    response = client.get("/api/v1/auth/github/callback?code=mock_code")
    assert response.status_code == 307
    assert "http://localhost:5173/auth?token=mock_access_token&user_id=12345" in response.headers["location"]

# Average Case 3: Existing user login
@pytest.mark.usefixtures("db")
def test_existing_user_login(db: Session):
    """
    Test login for an existing user.
    
    Parameters:
        db (Session): The mock database session

    Assertions:
        - The response status code is 307 (Temporary Redirect).
        - The response location header contains the redirect URL with the token and user ID.
    """
    create_mock_oauth_user(db, "google", "12345", "test@example.com")
    app.dependency_overrides[get_oauth_token] = lambda provider, code: {"access_token": "mock_access_token"}
    app.dependency_overrides[get_oauth_user_info] = lambda provider, token: {
        "id": "12345",
        "email": "test@example.com",
        "name": "Test User",
        "picture": "http://example.com/avatar.png"
    }

    response = client.get("/api/v1/auth/google/callback?code=mock_code")
    assert response.status_code == 307


# Average Case 4: New user login
@pytest.mark.usefixtures("db")
def test_new_user_login(db: Session):
    """
    Test login for a new user.

    Parameters:
        db (Session): The mock database session

    Assertions:
        - The response status code is 307 (Temporary Redirect).
        - The response location header contains the redirect URL with the token and user ID.
    """
    app.dependency_overrides[get_oauth_token] = lambda provider, code: {"access_token": "mock_access_token"}
    app.dependency_overrides[get_oauth_user_info] = lambda provider, token: {
        "id": "67890",
        "email": "newuser@example.com",
        "name": "New User",
        "picture": "http://example.com/avatar.png"
    }

    response = client.get("/api/v1/auth/google/callback?code=mock_code")
    assert response.status_code == 307
    assert "http://localhost:5173/auth?token=mock_access_token&user_id=67890" in response.headers["location"]

# Error Case 1: Failed to obtain access token
def test_failed_to_obtain_access_token():
    """
    Test the callback when failing to obtain an access token.

    Assertions:
        - The response status code is 400 (Bad Request).
        - The response JSON contains the detail "Failed to obtain access token".
    """
    app.dependency_overrides[get_oauth_token] = lambda provider, code: {}
    response = client.get("/api/v1/auth/google/callback?code=mock_code")
    assert response.status_code == 400
    assert response.json() == {"detail": "Failed to obtain access token"}

# Error Case 2: Failed to fetch user info
def test_failed_to_fetch_user_info():
    """
    Test the callback when failing to fetch user info.

    Assertions:
        - The response status code is 400 (Bad Request).
        - The response JSON contains the detail "Failed to fetch user info".
    """
    app.dependency_overrides[get_oauth_token] = lambda provider, code: {"access_token": "mock_access_token"}
    app.dependency_overrides[get_oauth_user_info] = lambda provider, token: {}
    response = client.get("/api/v1/auth/google/callback?code=mock_code")
    assert response.status_code == 400
    assert response.json() == {"detail": "Failed to fetch user info"}