from sqlalchemy import Column, Integer, String, DateTime, BLOB,ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.orm import relationship

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("oauth_users.id"), nullable=False)  # Reference OAuthUser
    spot_id = Column(Integer, ForeignKey("spots.spot_id"), nullable=False)  # Reference Spot
    rating_score = Column(Integer, nullable=False)
    review_description = Column(String, nullable=True)
    image = Column(BLOB, nullable=True)
    owner_reply = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
