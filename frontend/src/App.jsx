import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Drawer, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { NavBar } from "./components/NavBar";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Booking } from "./pages/Booking";
import { BookingHistory } from "./pages/BookingHistory";
import { MySpots } from "./pages/MySpots";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";

const AppLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const user_id = params.get("user_id");
        if (token) {
            localStorage.setItem("token", String(token));
            localStorage.setItem("user_id", String(user_id))
            navigate("/home");
        }
    }, [navigate]);
    
    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    if (!user) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    sx={{ margin: 1 }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
            <Drawer
                variant="persistent"
                anchor="left"
                open={isDrawerOpen}
                sx={{
                    width: 350,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 350,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                <NavBar user={user} logout={logout} />
            </Drawer>
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
                    <Route path="/booking" element={<Booking />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;