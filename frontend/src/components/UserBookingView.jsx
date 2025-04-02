import { useState } from "react";
import {
	Typography,
	Paper,
	Box,
	Button,
	Divider,
	Table,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Collapse,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { CurrencyRupee } from "@mui/icons-material";

const UserBookingView = ({ bookingDetails, cancelBooking }) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState(null);

	/**
	 * Handles opening the confirmation dialog.
	 *
	 * @param {number} bookingId - The ID of the booking to cancel.
	 */
	const handleOpenDialog = (bookingId) => {
		setSelectedBookingId(bookingId);
		setOpenDialog(true);
	};

	/**
	 * Handles closing the confirmation dialog.
	 */
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedBookingId(null);
	};

	/**
	 * Confirms the cancellation of the booking.
	 */
	const handleConfirmCancel = () => {
		if (selectedBookingId) {
			cancelBooking(selectedBookingId);
		}
		handleCloseDialog();
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Cost</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Payment Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{bookingDetails != [] ? (
							bookingDetails.map((booking) => (
								<TableRow key={booking.id}>
									<TableCell slotProps={{ secondary: { color: "info" } }}>
										<Typography>{booking.spot_title}</Typography>
										<Collapse in={true} unmountOnExit>
											{`From: ${booking.start_date_time} - ${booking.end_date_time}`}
										</Collapse>
									</TableCell>
									<TableCell>
										<CurrencyRupee fontSize="small"></CurrencyRupee> {booking.payment_amount}
									</TableCell>
									<TableCell>{booking.status}</TableCell>
									<TableCell>{booking.payment_status}</TableCell>
									<TableCell>
										<Box>
											<Button
												onClick={() => handleOpenDialog(booking.id)}
												variant="contained"
												color="error"
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
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Confirm Cancellation</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to cancel this booking?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						No
					</Button>
					<Button onClick={handleConfirmCancel} color="secondary" variant="contained">
						Yes, Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export { UserBookingView };
