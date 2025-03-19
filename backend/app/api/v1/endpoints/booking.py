from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session #interact with database
from app.db.session import get_db
from app.services.booking_service import create_booking
from app.schemas.booking import BookingCreate

router = APIRouter()

@router.post("/book-spot")
def book_spot(booking_data: BookingCreate, db: Session = Depends(get_db)):
    return create_booking(db, booking_data)
