import { useEffect, useState, useContext } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserBookingView = () => {
    const [bookings, setBookings] = useState([]);
    const {user} = useContext(AuthContext);

    useEffect(() => {
        axios.get(`/bookings/user/${user.id}`)
            .then(response => setBookings(response.data))
            .catch(error => console.error("Error fetching user bookings:", error));
    }, [user.id]);

    return (
        <Container>
            <List>
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <ListItem key={booking.id}>
                            <ListItemText primary={booking.location} secondary={`From DateTime: ${booking.start_datetime} - ${booking.end_datetime} | Status: ${booking.status}`} />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No bookings found.</Typography>
                )}
            </List>
        </Container>
    );
};

export { UserBookingView };