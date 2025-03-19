import { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, Grid, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../style/booking.css";
//spot_information is object which hold the all information
export const Booking = ({spot_information, user_id}) => {
    // const navigate = useNavigate()
    const [totalSlots, setTotalSlots] = useState(1);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [ratePerHour] = useState(spot_information.charge_per_hour);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(false);

    const showSnackbar = (message, severity = "info") => {
        setOpenSnackbar({ open: true, message, severity });
    };

    const validateDateTime = (selectedDate) => {
        if (!selectedDate || new Date(selectedDate).getTime() <= new Date().getTime()) {
            showSnackbar("Please select a future date and time.", "error");
            return false;
        }
        return true;
    };

    const dateTimeToString = (date) => {
        return date.toISOString().replace("T", " ").slice(0, 19);
    };

    const calculateAmount = () => {
        if(paymentStatus) {
            return;
        }
        if (!startTime || !endTime) {
            showSnackbar("Please select start and end time.", "warning");
            return false;
        }

        if (totalSlots <= 0) {
            showSnackbar("Total Slot should be greater than zero.", "warning");
            return false;
        }

        if (!validateDateTime(startTime) || !validateDateTime(endTime)) {
            return false;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffInMs = end - start;
        let hours = Math.ceil(diffInMs / (1000 * 60 * 60));

        if (hours <= 0) {
            showSnackbar("End time must be after start time.", "error");
            return false;
        }

        setTotalAmount(hours * ratePerHour * totalSlots);
        setOpenDialog(true);
        return true;
    };

    const loadRazorpay = async () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const processPayment = async () => {
        if(paymentStatus) {
            return;
        }
        try {
            const razorpayLoaded = await loadRazorpay();
            if (!razorpayLoaded) {
                showSnackbar("Failed to load Razorpay SDK.", "error");
                return;
            }

            const start_time = dateTimeToString(startTime);
            const end_time = dateTimeToString(endTime);

            if(spot_information.available_slots < totalSlots){
                showSnackbar("No Slots availables", "error");
                return;
            }
            const orderResponse = await axios.post("http://127.0.0.1:8000/bookings/book-spot", {
                user_id: user_id.toString(),
                spot_id: spot_information.spot_id,
                total_slots: totalSlots,
                total_amount: totalAmount,
                start_date_time: start_time,
                end_date_time: end_time,
                receipt: `booking_${Date.now()}`
            });

            const orderData = orderResponse.data;

            if (!orderData.order_id) {
                showSnackbar("Error creating order", "error");
                return;
            }

            const options = {
                key: "rzp_test_JcFPR4o6XJnTf8",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Parking Service",
                description: `Booking for ${totalSlots} slot(s)`,
                order_id: orderData.order_id,
                handler: function (response) {
                    setPaymentDetails({
                        name: "ABC Parking Service",
                        description: `Booking for ${totalSlots} slot(s)`,
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        amount: totalAmount,
                        start_time,
                        end_time,
                    });
                    setPaymentStatus(true);
                    showSnackbar("Booking Successful!", "success");
                },
                theme: { color: "#4F46E5" }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            showSnackbar("Booking failed!", error);
        }
    };

    const downloadPDF = () => {
        if (!paymentDetails) return;

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Parking Booking Receipt", 70, 20);

        doc.setFontSize(12);
        doc.text(`Spot Name: ${spot_information.spot_title}`, 20, 40);
        doc.text(`Spot Address: ${spot_information.spot_address}`, 20, 50);
        doc.text(`Total Slots: ${totalSlots}`, 20, 60);
        doc.text(`Order ID: ${paymentDetails.order_id}`, 20, 70);
        doc.text(`Payment ID: ${paymentDetails.payment_id}`, 20, 80);
        doc.text(`Total Amount: ₹${paymentDetails.amount}`, 20, 90);
        doc.text(`Start Time: ${paymentDetails.start_time}`, 20, 100);
        doc.text(`End Time: ${paymentDetails.end_time}`, 20, 110);
        
        doc.save("booking_receipt.pdf");
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="form-container">
                <Box className="form-container">
                {/* Circular Button to Go Back */}
                    <IconButton
                        // onClick={() => navigate(-1)}
                        sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "white",
                        border: "1px solid gray",
                        "&:hover": { backgroundColor: "lightgray" }
                    }}
                >
                        <ArrowBackIcon />
                    </IconButton>
                <Box className="form-box">
                    <Typography variant="h5" gutterBottom align="center">
                        Book Your Parking Spot
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Total Slots" type="number" value={totalSlots} onChange={(e) => setTotalSlots(Number(e.target.value))} />
                        </Grid>

                        <Grid item xs={12}>
                            <DateTimePicker label="Start Time" value={startTime} onChange={setStartTime} renderInput={(params) => <TextField {...params} fullWidth />} />
                        </Grid>

                        <Grid item xs={12}>
                            <DateTimePicker label="End Time" value={endTime} onChange={setEndTime} renderInput={(params) => <TextField {...params} fullWidth />} />
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="contained" color="secondary" fullWidth onClick={calculateAmount}>
                                Book Spot
                            </Button>
                            { paymentDetails &&
                            <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ mt: 2, mr: 2 }}>
                        Download Receipt
                            </Button>
                        }
                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                       GO HOME
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                </Box>
            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Total Amount</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">You need to pay ₹{totalAmount}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => { setOpenDialog(false); processPayment(); }} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>


            <Snackbar open={openSnackbar.open} autoHideDuration={3000} onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}>
                <Alert severity={openSnackbar.severity} variant="filled">
                    {openSnackbar.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
}; 