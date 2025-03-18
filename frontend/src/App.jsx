import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Dashboard }from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Booking } from "./pages/Booking";
const spot = {
    spot_id: 1,
    charge_per_hour: 50, // Assuming price per hour
    spot_title: "Green Park Charging Spot",
    spot_address: "A convenient EV charging station located in the heart of the city with fast chargers.",
    available_slots: 9,
    open_time: "08:00 AM",
    close_time: "10:00 PM"
  };
  
function App() {
    return (
        // <AuthProvider>
        //     <Router>
        //         <Routes>
        //             <Route path="/" element={<Login />} />
        //             <Route path="/profile" element={<Profile />} />
        //             <Route path="/dashboard" element={<Dashboard />} />
        //         </Routes>
        //     </Router>
        // </AuthProvider>
        <Booking spot_information = {spot} user_id={101}></Booking>
    );
}

export default App;
