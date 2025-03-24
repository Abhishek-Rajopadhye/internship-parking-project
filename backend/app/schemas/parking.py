from pydantic import BaseModel
from datetime import time

class ParkingSchema(BaseModel):
    owner_id: int
    spot_id: int
    address: str
    lat:float
    lng:float
    hourly_rate: int
    no_of_slots: int
    available_slots: int
    openTime:time
    closeTime:time
    instruction: str
    days_available: List[str]
    image:List[str]
