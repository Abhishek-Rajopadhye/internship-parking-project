import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { NavBar } from "./components/NavBar";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { BookingHistory } from "./pages/BookingHistory";
import { MySpots } from "./pages/MySpots";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";

const AppLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const user_id = params.get("user_id");
        console.log(token, user_id);
        if (token) {
            localStorage.setItem("token", String(token));
            localStorage.setItem("user_id", String(user_id))
            navigate("/home");
        }
    }, [navigate]);

    if (!user) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex" }}>
            <NavBar user={user} logout={logout} />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/booking-history" element={<BookingHistory />} />
                    <Route path="/my-spots" element={<MySpots />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </Box>
        </Box>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/*" element={<AppLayout />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;