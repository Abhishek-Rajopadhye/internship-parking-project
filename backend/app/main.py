import fastapi
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, user, booking
from app.db.session import Base
from app.db.session import engine

app = fastapi.FastAPI(title="Smart Parking")

origins = [
    "http://localhost",
    "http://localhost:5173"
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(booking.router, prefix="/bookings", tags=["Bookings"])