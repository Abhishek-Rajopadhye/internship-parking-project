import React, { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, Grid, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import "../style/booking.css";

export const Booking = ({user_id, spot_id, charges_per_hr}) => {
    const [totalSlots, setTotalSlots] = useState(1);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [ratePerHour] = useState(charges_per_hr);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: "", severity: "info" });

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
        if (!startTime || !endTime) {
            showSnackbar("Please select start and end time.", "warning");
            return false;
        }

        if (totalSlots <= 0) {
            showSnackbar("Total Slot should be greater than zero.", "warning");
            return false;
        }

        if(!validateDateTime(startTime) || !validateDateTime(endTime)) {
            return false;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffInMs = end - start;
        let hours = diffInMs / (1000 * 60 * 60);
        hours = Math.ceil(hours);

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
        try {
            const razorpayLoaded = await loadRazorpay();
            if (!razorpayLoaded) {
                showSnackbar("Failed to load Razorpay SDK.", "error");
                return;
            }
            // converting date to string
            const start_time = dateTimeToString(startTime); 
            const end_time = dateTimeToString(endTime);
            console.log(time1)
            console.log(time2)
            const orderResponse = await axios.post("http://127.0.0.1:8000/bookings/book-spot", {
                user_id: user_id.toString(),
                spot_id: spot_id,
                total_slots: totalSlots,
                total_amount: totalAmount,
                start_date_time: start_time,
                end_date_time: end_time,
                currency: "INR",
                receipt: `booking_${Date.now()}`
            });

            const orderData = orderResponse.data;
            console.log(orderData)
            if (!orderData.order_id) {
                showSnackbar("Error creating order", "error");
                return;
            }
            showSnackbar("Booking Successful!", "success");
            //to verify payment transaction optional..
            // const options = {
            //     key: "rzp_test_JcFPR4o6XJnTf8",
            //     amount: orderData.amount,
            //     currency: orderData.currency,
            //     name: "Parking Service",
            //     description: `Booking for ${totalSlots} slot(s)`,
            //     order_id: orderData.order_id,
                // handler: async function (response) {
                //     try {
                //         const verifyResponse = await axios.post("http://127.0.0.1:8000/verify-payment", {
                //             razorpay_order_id: response.razorpay_order_id,
                //             razorpay_payment_id: response.razorpay_payment_id,
                //             razorpay_signature: response.razorpay_signature
                //         });

                //         if (verifyResponse.data.status === "Payment Successful") {
                //             showSnackbar("Booking Successful!", "success");
                //         } else {
                //             showSnackbar("Payment Failed!", "error");
                //         }
                //     } catch (error) {
                //         showSnackbar("Payment verification failed!", "error");
                //     }
                // },
                // theme: { color: "#4F46E5" }
            //};

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            showSnackbar("Booking failed!", "error");
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="form-container">
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
                        </Grid>
                    </Grid>
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
            {/* Snackbar for messages */}
            <Snackbar
            open={openSnackbar.open}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
            >
                <Alert severity={openSnackbar.severity} variant="filled">
                    {openSnackbar.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

// export  {Booking};
