// BookingHistory.jsx
import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { OwnerBookingView } from "../components/OwnerBookingView";
import { UserBookingView } from "../components/UserBookingView";

const BookingHistory = () => {
    const [bookingHistoryToggle, setBookingHistoryToggle] = useState(0);

    return (
        <>
            <Box sx={{ position:"relative", top:0, borderBottom: 1, borderColor: 'divider' }} variant="fullWidth">
                <Tabs centered variant="fullWidth" value={bookingHistoryToggle} onChange={()=>{
                    if(bookingHistoryToggle === 0){
                        setBookingHistoryToggle(1);
                    }
                    else{
                        setBookingHistoryToggle(0);
                    }
                }} aria-label="basic tabs example">
                    <Tab label="My Booking History"/>
                    <Tab label="My Spots' Booking History" />
                </Tabs>
            </Box>
            {bookingHistoryToggle==1 && <OwnerBookingView />}
            {bookingHistoryToggle==0 && <UserBookingView />}
        </>
    );
};

export { BookingHistory };