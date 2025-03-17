import { useContext, useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
            {user ? (
                <>
                    <Typography variant="h4">Welcome, {user.name}!</Typography>
                    <img src={user.profile_picture} alt="Profile" width="100" style={{ borderRadius: "50%" }} />
                    <Typography>Email: {user.email}</Typography>
                    <Button variant="contained" color="error" onClick={logout} style={{ marginTop: "20px" }}>
                        Logout
                    </Button>
                </>
            ) : (
                <Typography variant="h5">Loading user data...</Typography>
            )}
        </Container>
    );
};

export { Dashboard };
