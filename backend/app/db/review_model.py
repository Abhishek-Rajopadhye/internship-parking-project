
from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.db import Base
from app.db.oauth_model import OAuthUser

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("oauth_users.provider_id"), nullable=False)  # Reference OAuthUser
    spot_id = Column(Integer, ForeignKey("spots.spot_id"), nullable=False)  # Reference Spot
    rating_score = Column(Integer, nullable=False)
    review_description = Column(String, nullable=True)
    image = Column(LargeBinary, nullable=True)
    owner_reply = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("OAuthUser", backref="reviews")