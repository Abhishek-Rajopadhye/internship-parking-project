import { useState } from "react";
import { Container, Tabs, Tab } from "@mui/material";
import { UserBookingView } from "../components/UserBookingView";
import { OwnerBookingView } from "../components/OwnerBookingView";

const BookingHistory = () => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Container>
            <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
                <Tab label="User Bookings" />
                <Tab label="Owner Bookings" />
            </Tabs>
            {tabIndex === 0 && <UserBookingView />}
            {tabIndex === 1 && <OwnerBookingView />}
        </Container>
    );
};

export { BookingHistory };
