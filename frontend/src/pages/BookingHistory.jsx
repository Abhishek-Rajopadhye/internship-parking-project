import { useContext, useEffect, useState } from "react";
import { Container, Tabs, Tab, AppBar } from "@mui/material";
import { UserBookingView } from "../components/UserBookingView";
import { OwnerBookingView } from "../components/OwnerBookingView";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "../const";

const BookingHistory = () => {
	const [tabIndex, setTabIndex] = useState("0");
	const { user } = useContext(AuthContext);
	const [userBookings, setUserBookings] = useState([]);
	const [ownerBookings, setOwnerBookings] = useState([]);

	useEffect(() => {
		const fetchDetailsUserBookings = async () => {
			const response = await axios.get(`${BACKEND_URL}/bookings/user/${user.id}`);
			if (response.status == 200) {
				setUserBookings(response.data);
			}
		};

		const fetchDetailsOwnerBookings = async () => {
			const response = await axios.get(`${BACKEND_URL}/bookings/owner/${user.id}`);
			if (response.status == 200) {
				setOwnerBookings(response.data);
			}
		};

		fetchDetailsUserBookings();
		fetchDetailsOwnerBookings();
	}, [user.id]);

	const handleCancelBooking = async (bookingId, tab) => {
		const response = await axios.delete(`${BACKEND_URL}/bookings/${bookingId}`);
		if (response.status == 200) {
			if (tab == "owner") {
				const owner_details_response = await axios.get(`${BACKEND_URL}/bookings/owner/${user.id}`);
				if (owner_details_response.status == 200) {
					setOwnerBookings(owner_details_response.data);
				}
			} else {
				const user_details_response = await axios.get(`${BACKEND_URL}/bookings/user/${user.id}`);
				if (user_details_response.status == 200) {
					setUserBookings(user_details_response.data);
				}
			}
		}
	};

	return (
		<Container sx={{ position: "relative", mt: 30, mr: 150, width: "85%" }}>
			<TabContext value={tabIndex}>
				<AppBar sx={{ position: "relative", mt: 30, width: "100%", borderRadius: 2 }}>
					<TabList
						slotProps={{
							indicator: {
								style: {
									backgroundColor: "white",
								},
							},
						}}
						onChange={(e, newIndex) => setTabIndex(newIndex)}
						variant="fullWidth"
						centered
						sx={{ borderRadius: 2, "&.Mui-selected": { color: "black" } }}
					>
						<Tab label="User Bookings" value="0" sx={{ color: "black", "&.Mui-selected": { color: "white" } }} />
						<Tab label="Owner Bookings" value="1" sx={{ color: "black", "&.Mui-selected": { color: "white" } }} />
					</TabList>
				</AppBar>
				<TabPanel value="0" sx={{ height: "100vh" }}>
					<UserBookingView bookingDetails={userBookings} cancelBooking={handleCancelBooking} />
				</TabPanel>
				<TabPanel value="1" sx={{ height: "100vh" }}>
					<OwnerBookingView bookingDetails={ownerBookings} />
				</TabPanel>
			</TabContext>
		</Container>
	);
};

export { BookingHistory };
