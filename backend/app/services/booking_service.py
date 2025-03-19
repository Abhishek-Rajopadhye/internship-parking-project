import razorpay
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.booking_model import Booking
from app.db.payment_model import Payment
from fastapi import HTTPException
from sqlalchemy import text

# Load Razorpay keys
RAZORPAY_KEY_ID = settings.RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET = settings.RAZORPAY_KEY_SECRET

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

#Custom Exceptions
class SlotUnavailableException(Exception):
    """Raised when no slots are available for booking."""
    
    def __init__(self, message="No slots available for booking."):
        self.message = message
        super().__init__(self.message)


class PaymentFailedException(Exception):
    """Raised when the payment process fails."""

    def __init__(self, message="Payment process failed. Please try again."):
        self.message = message
        super().__init__(self.message)


class BookingFailedException(Exception):
    """Raised when booking cannot be completed."""

    def __init__(self, message="Booking process failed. Please contact support."):
        self.message = message
        super().__init__(self.message)


#Check slot availability before processing payment
def check_available_slots(db: Session, spot_id: int, total_slots: int):
    try:
        query = text("SELECT * FROM spots WHERE spot_id = :spot_id")
        result = db.execute(query, {"spot_id": spot_id})
        spot = result.fetchone()
        
        if not spot:
            raise SlotUnavailableException("Spot not found.")

        available_slots = spot.available_slots
        if available_slots >= total_slots:
            # Update available slots
            query = text(
                "UPDATE spots SET available_slots = available_slots - :total_slots WHERE spot_id = :spot_id"
            )
            db.execute(query, {"spot_id": spot_id, "total_slots": total_slots})
            db.commit()
            return True
        else:
            # raise SlotUnavailableException("No slots available.")
            return False
    
    except SlotUnavailableException as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


#Create a new booking
async def create_booking(db: Session, booking_data):
    try:
        print("This is in service model");
        # print("This is service method")
        # Step 1: Check slot availability
        if not check_available_slots(db, booking_data.spot_id, booking_data.total_slots):
            raise SlotUnavailableException()

        # Step 2: Create Razorpay Order
        try:
           
            order_data = {
                "amount": booking_data.total_amount * 100,  # Convert INR to paise
                "currency": "INR",
                "receipt": f"receipt_{booking_data.user_id}",
                "payment_capture": 1  # Auto capture
            }
            razorpay_order = razorpay_client.order.create(order_data)
        except Exception as e:
            raise PaymentFailedException(f"Failed to create Razorpay order: {str(e)}")

        # Step 3: Store Payment Info in DB
        new_payment = Payment(
            user_id=booking_data.user_id,
            spot_id=booking_data.spot_id,
            amount=booking_data.total_amount,
            razorpay_order_id=razorpay_order["id"],
            status="pending"  # Initial status
        )
        db.add(new_payment)
        db.commit()
        db.refresh(new_payment)

        # Step 4: Simulate Payment Verification (to be replaced with actual webhook handling)
        payment_status = "success"  # Simulating success
        if payment_status == "success":
            new_payment.status = "success"
            db.commit()
        else:
            new_payment.status = "failed"
            db.commit()
            raise PaymentFailedException("Payment verification failed.")

        # Step 5: Store Booking in DB
        new_booking = Booking(
            user_id=booking_data.user_id,
            spot_id=booking_data.spot_id,
            total_slots=booking_data.total_slots,
            start_date_time=booking_data.start_date_time,
            end_date_time=booking_data.end_date_time,
            payment_id=new_payment.id
        )
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        return {
            "order_id": razorpay_order["id"], 
            "amount": razorpay_order["amount"], 
            "currency": razorpay_order["currency"],
            "booking_id": new_booking.id,
            "payment_status": "success",
            "receipt": razorpay_order["receipt"]
        }
    
    except SlotUnavailableException as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="No Slot Available")
    except PaymentFailedException as e:
        db.rollback()
        raise HTTPException(status_code=402, detail=str(e))  # 402 Payment Required
    
    except BookingFailedException as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
