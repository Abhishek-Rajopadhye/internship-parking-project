import { useEffect, useState, useContext } from 'react';
import { Box, Button, Card, CardContent, Typography, List, ListItem, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserBookingView = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Fetch user bookings from the API
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/bookings/user/${user.id}`);
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [user.id]);

    const handleEdit = (bookingId) => {
        // Handle edit booking action
        console.log('Edit booking:', bookingId);
    };

    const handleCancel = (bookingId) => {
        // Handle cancel booking action
        console.log('Cancel booking:', bookingId);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>
            <List>
                {bookings.map((booking) => (
                    <ListItem key={booking.id} sx={{ marginBottom: 2 }} 
                        secondaryAction={booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'in progress' && (
                            <>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(booking.id)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="cancel" onClick={() => handleCancel(booking.id)}>
                                    <CancelIcon />
                                </IconButton>
                            </>
                    )}>
                        <Card sx={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">{booking.spot_name}</Typography>
                                <Typography variant="body2">Total Cost: ${booking.total_cost}</Typography>
                                <Typography variant="body2">Status: {booking.status}</Typography>
                                <Typography variant="body2">Booking Timings: {booking.start_time} - {booking.end_time}</Typography>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export { UserBookingView };