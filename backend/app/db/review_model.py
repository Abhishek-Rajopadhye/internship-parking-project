from sqlalchemy import Column, Integer, String, DateTime, BLOB
from sqlalchemy.sql import func
from app.db.session import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    spot_id = Column(Integer, nullable=False)
    rating_score = Column(Integer, nullable=False)
    review_description = Column(String, nullable=True)
    image = Column(BLOB, nullable=True)
    owner_reply = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
