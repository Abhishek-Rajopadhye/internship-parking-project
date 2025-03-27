from typing import List
from pydantic import BaseModel

class ParkingSpot(BaseModel):
    spot_id: int
    owner_id: str
    spot_title: str
    address: str
    latitude: float
    longitude: float
    hourly_rate: int
    no_of_slots: int
    available_slots: int
    open_time: str
    close_time: str
    description: str
    available_days: List[str]
