from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session #interact with database
from app.db.session import get_db
from app.services.booking_service import create_booking
from app.schemas.booking import BookingCreate

router = APIRouter()

@router.post("/book-spot")
async def book_spot(booking_data: BookingCreate, db: Session = Depends(get_db)):
    try:
        response = await create_booking(db, booking_data)
        print(response)
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["detail"])
        return response
    except Exception as exception:
        print(exception)
        raise HTTPException(status_code=400, detail=exception.detail)