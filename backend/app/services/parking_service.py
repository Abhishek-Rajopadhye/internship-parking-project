
from sqlalchemy.orm import Session
from app.db.spot_model import Spot
from app.schemas.parking import ParkingSpot
from typing import List


def get_all_parking_spots(db: Session) -> List[ParkingSpot]:
    return db.query(Spot).all()
