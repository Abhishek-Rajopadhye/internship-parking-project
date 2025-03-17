from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    spot_id = Column(Integer, nullable=False) #slot_id(parking_id)
    total_slots = Column(Integer, nullable=False)
    start_date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_date = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
