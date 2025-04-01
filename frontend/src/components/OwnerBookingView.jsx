import { useContext, useEffect, useState } from "react";
import { Typography, Paper, Box, Button, Divider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Collapse } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Adjust the import path as necessary
import { CurrencyRupee } from "@mui/icons-material";

const OwnerBookingView = () => {
	const [bookings, setBookings] = useState([]);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		const fetchDetails = async () => {
			const response = await axios.get(`http://localhost:8000/bookings/owner/${user.id}`);
			if (response.status == 200) {
				setBookings(response.data);
			}
		};

		fetchDetails();
	}, [user.id]);

	const handleEdit = (bookingId) => {
		console.log("Edit booking", bookingId);
		// Implement edit functionality
	};

	const handleCancel = (bookingId) => {
		console.log("Cancel booking", bookingId);
		// Implement cancel functionality
	};

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Cost</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{bookings != [] ? (
						bookings.map((booking) => (
							<TableRow
								key={booking.id}
							>
								<TableCell
									slotProps={{ secondary: { color: "info" } }}
								>
									<Typography>{booking.spot_title}</Typography>
									<Collapse in={true} unmountOnExit>
										{`From: ${booking.start_date_time} - ${booking.end_date_time}`}
									</Collapse>
								</TableCell>
								<TableCell>
									<CurrencyRupee fontSize="small"></CurrencyRupee> {booking.payment_amount}
								</TableCell>
								<TableCell>{booking.payment_status}</TableCell>
								<TableCell>
								<Box>
										<Button
											onClick={() => handleEdit(booking.id)}
											variant="contained"
											color="primary"
											size="small"
											sx={{ mr: 1 }}
										>
											Edit
										</Button>
										<Button
											onClick={() => handleCancel(booking.id)}
											variant="contained"
											color="secondary"
											size="small"
										>
											Cancel
										</Button>
									</Box>
								</TableCell>
								
								<Divider />
							</TableRow>
						))
					) : (
						<Typography>No bookings found.</Typography>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export { OwnerBookingView };
