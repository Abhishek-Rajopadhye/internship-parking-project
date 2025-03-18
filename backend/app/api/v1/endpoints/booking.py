from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session #interact with database
from app.db.session import get_db
from app.db.session import SessionLocal
from app.services.booking_service import create_booking
from app.schemas.booking import BookingCreate

router = APIRouter()

@router.post("/book-spot")
async def book_spot(booking_data: BookingCreate, db: Session = Depends(get_db)):
    response = await create_booking(db, booking_data)
    if "error" in response:
        raise HTTPException(status_code=400, detail="Booking request failed. Please check your inputs")
    return response