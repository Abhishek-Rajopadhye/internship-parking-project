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
	IconButton,
} from "@mui/material";
import { CurrencyRupee } from "@mui/icons-material";
import { ConfirmationDialogBox } from "./ConfirmationDialogBox";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

/**
 * UserBookingView Component
 *
 * This component displays a table of user booking details and allows users to cancel bookings,
 * check in, and check out. It also allows expanding rows to show additional details like the address.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.bookingDetails - An array of booking details to display.
 * @param {Function} props.cancelBooking - A function to handle booking cancellation.
 * @param {Function} props.checkIn - A function to handle check-in.
 * @param {Function} props.checkOut - A function to handle check-out.
 *
 * @returns {JSX.Element} The rendered UserBookingView component.
 */
const UserBookingView = ({ bookingDetails, cancelBooking, checkIn, checkOut }) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [dialogAction, setDialogAction] = useState(null); // Function to execute on confirmation
	const [expandedRow, setExpandedRow] = useState(null); // Track which row is expanded

	/**
	 * Handles opening the confirmation dialog.
	 *
	 * @param {number} bookingId - The ID of the booking.
	 * @param {string} actionType - The type of action ("cancel", "checkIn", or "checkOut").
	 */
	const handleOpenDialog = (bookingId, actionType) => {

		if (actionType === "cancel") {
			setDialogMessage("Are you sure you want to cancel this booking?");
			setDialogAction(() => () => cancelBooking(bookingId));
		} else if (actionType === "checkIn") {
			setDialogMessage("Are you sure you want to check in for this booking?");
			setDialogAction(() => () => checkIn(bookingId));
		} else if (actionType === "checkOut") {
			setDialogMessage("Are you sure you want to check out for this booking?");
			setDialogAction(() => () => checkOut(bookingId));
		}

		setOpenDialog(true);
	};

	/**
	 * Handles closing the confirmation dialog.
	 */
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setDialogMessage("");
		setDialogAction(null);
	};

	/**
	 * Toggles the expanded state of a row.
	 *
	 * @param {number} bookingId - The ID of the booking to expand or collapse.
	 */
	const toggleRowExpansion = (bookingId) => {
		setExpandedRow((prev) => (prev === bookingId ? null : bookingId));
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Name</TableCell>
							<TableCell>Cost</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Payment Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{bookingDetails.length > 0 ? (
							bookingDetails.map((booking) => (
								<>
									<TableRow key={booking.id}>
										<TableCell>
											<IconButton
												aria-label="expand row"
												size="small"
												onClick={() => toggleRowExpansion(booking.id)}
											>
												{expandedRow === booking.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
											</IconButton>
										</TableCell>
										<TableCell>
											<Typography>{booking.spot_title}</Typography>
											<Collapse in={true} unmountOnExit>
												{`From: ${booking.start_date_time} - ${booking.end_date_time}`}
											</Collapse>
										</TableCell>
										<TableCell>
											<CurrencyRupee fontSize="small" /> {booking.payment_amount}
										</TableCell>
										<TableCell>{booking.status}</TableCell>
										<TableCell>{booking.payment_status}</TableCell>
										<TableCell>
											<Box display="flex" gap={1}>
												{/* Show Cancel button only if status is Pending */}
												{booking.status === "Pending" && (
													<Button
														onClick={() => handleOpenDialog(booking.id, "cancel")}
														variant="contained"
														color="error"
														size="small"
													>
														Cancel
													</Button>
												)}

												{/* Show Check-In button if status is Pending */}
												{booking.status === "Pending" && (
													<Button
														onClick={() => handleOpenDialog(booking.id, "checkIn")}
														variant="contained"
														color="primary"
														size="small"
													>
														Check In
													</Button>
												)}

												{/* Show Check-Out button if status is Checked In */}
												{booking.status === "Checked In" && (
													<Button
														onClick={() => handleOpenDialog(booking.id, "checkOut")}
														variant="contained"
														color="success"
														size="small"
													>
														Check Out
													</Button>
												)}

												{/* Placeholder space for actions when status is Cancelled or Completed */}
												{(booking.status === "Cancelled" || booking.status === "Completed") && (
													<Box width="100px" />
												)}
											</Box>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
											<Collapse in={expandedRow === booking.id} timeout="auto" unmountOnExit>
												<Box margin={1}>
													<Typography variant="subtitle1" gutterBottom>
														Address:
													</Typography>
													<Typography>{booking.address}</Typography>
												</Box>
											</Collapse>
										</TableCell>
									</TableRow>
								</>
							))
						) : (
							<Typography>No bookings found.</Typography>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Confirmation Dialog */}
			<ConfirmationDialogBox
				open={openDialog}
				message={dialogMessage}
				onConfirm={() => {
					if (dialogAction) dialogAction();
					handleCloseDialog();
				}}
				onCancel={handleCloseDialog}
			/>
		</>
	);
};

export { UserBookingView };
