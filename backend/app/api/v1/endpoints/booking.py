from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session #interact with database
from app.db.session import get_db
from app.services.booking_service import create_booking
from app.schemas.booking import BookingCreate

router = APIRouter()

@router.post("/book-spot")
async def book_spot(booking_data: BookingCreate, db: Session = Depends(get_db)):
    """
    Book a parking spot for the user.

    Args:
        booking_data (BookingCreate): Booking data
        db (Session, optional): SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        dict: Response message otherwise raise appropriate HTTPException and return the error message

    Example:
        book_spot(booking_data)
        booking a parking spot for the user
        return the booking details
    """
    try:
        response = await create_booking(db, booking_data)
        print(response)
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["detail"])
        return response
    except Exception as exception:
        print(exception)
        raise HTTPException(status_code=400, detail=exception.detail)