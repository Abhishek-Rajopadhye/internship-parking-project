from app.db.session import Base 
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, ARRAY, LargeBinary


class ParkingSpot(Base):
    __tablename__ = 'parkingSpot'
    
    spot_id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, nullable=False)
    address = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float,nullable=False)
    hourly_rate = Column(Integer,nullable=False)
    no_of_slots = Column(Integer,nullable=False) 
    available_slots = Column(Integer,nullable=False)
    openTime=Column(String,nullable=False)
    closeTime=Column(String,nullable=False)
    instruction=Column(String)
    days_available=Column(ARRAY(String),nullable=False)
    image=Column(ARRAY(LargeBinary),nullable=True)


    
  
