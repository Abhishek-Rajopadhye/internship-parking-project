from app.schemas.add_spot import AddSpot
from sqlalchemy.orm import Session
from app.db.add_spot_model import Spot
from fastapi import HTTPException

def add_spot(spot: AddSpot, db: Session):
    """
    Add a parking spot for the user.

    Args:
        spot_data (AddSpot): Spot data
        db (Session): SQLAlchemy database session

    Returns:
        dict: Response message

    Example:
        add_spot(db, spot_data)
        add a parking spot for the user
        return the spot details
    """
    try:
      print(spot)
      new_spot = Spot(
          address=spot.spot_address,
          owner_id=spot.owner_id,
          spot_title=spot.spot_title,
          latitude=spot.latitude,
          longitude=spot.longitude,
          available_slots=spot.available_slots,
          no_of_slots=spot.total_slots,
          hourly_rate=spot.price_per_hour,
          open_time=spot.open_time,
          close_time=spot.close_time,
          description=spot.description,
          available_days=spot.available_days
      )
      db.add(new_spot)
      db.commit()
      db.refresh(new_spot)
      return {"message": "Spot added successfully.", "spot_id": new_spot.spot_id}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Error occur during adding spot.")