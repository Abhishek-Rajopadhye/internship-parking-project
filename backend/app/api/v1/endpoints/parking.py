from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # interact with database
from app.db.session import get_db
from app.services.parking_service import get_all_parking_spots
from app.schemas.parking import ParkingSpot
from typing import List


router = APIRouter()


@router.get("/getparkingspot", response_model=List[ParkingSpot])
async def fetch_parking_spots(db: Session = Depends(get_db)):
    spots = get_all_parking_spots(db)
    return spots
