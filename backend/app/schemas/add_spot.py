from pydantic import BaseModel

class AddSpot(BaseModel):
    spot_address: str
    owner_id: str
    spot_title: str
    latitude: float
    longitude: float
    available_slots: int
    total_slots: int
    price_per_hour: int
    open_time: str
    close_time: str
    description: str
    available_days: list[str]