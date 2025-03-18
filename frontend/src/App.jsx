import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Dashboard }from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import {Booking} from "./pages/Booking"

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
        <Booking user_id = {2} spot_id = {2} charges_per_hr = {20}></Booking>
    );
}

export default App;
