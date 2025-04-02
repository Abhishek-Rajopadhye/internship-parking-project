import {
	Typography,
	Paper,
	Divider,
	Table,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Collapse,
} from "@mui/material";
import { CurrencyRupee } from "@mui/icons-material";

const OwnerBookingView = ({ bookingDetails }) => {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Revenue</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Payment Status</TableCell>
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
