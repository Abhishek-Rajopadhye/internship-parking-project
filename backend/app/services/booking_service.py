import razorpay
import os
from sqlalchemy.orm import Session
from app.db.booking_model import Booking
from app.db.payment_model import Payment

# Load Razorpay keys
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

def create_booking(db: Session, booking_data):
    try:
        # Step 1: Create Razorpay Order
        order_data = {
            "amount": booking_data.total_amount * 100,  # Convert INR to paise
            "currency": "INR",
            "receipt": f"receipt_{booking_data.user_id}",
            "payment_capture": 1  # Auto capture
        }
        razorpay_order = razorpay_client.order.create(order_data)

        # Step 2: Store Payment Info in DB
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

        # Step 3: Simulate Payment Verification (implementation not done)
        payment_status = "success"  # Simulating success (should be verified via Razorpay webhook)
        if payment_status == "success":
            new_payment.status = "success"
            db.commit()

            # Step 4: Store Booking in DB
            new_booking = Booking(
                user_id=booking_data.user_id,
                spot_id=booking_data.spot_id,
                total_slots=booking_data.total_slots,
                start_date=booking_data.start_date,
                start_time=booking_data.start_time,
                end_date=booking_data.end_date,
                end_time=booking_data.end_time,
                payment_id=new_payment.id
            )
            db.add(new_booking)
            db.commit()
            db.refresh(new_booking)

            return {
                "booking_id": new_booking.id,
                "payment_status": "success",
                "receipt": razorpay_order["receipt"]
            }
        else:
            new_payment.status = "failed"
            db.commit()
            return {"payment_status": "failed"}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}
