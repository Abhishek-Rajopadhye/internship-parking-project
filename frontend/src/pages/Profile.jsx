import { useContext } from "react";
import { Container, Typography, Avatar, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) return <Typography variant="h5">Loading profile...</Typography>;

    return (
        <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
            <Avatar 
                src={user.profile_picture} 
                alt={user.name} 
                sx={{ width: 100, height: 100, margin: "auto" }} 
            />
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="h6">{user.email}</Typography>
            <Typography variant="h6">{user.phone || "Not provided"}</Typography>
            <Button 
                variant="contained" 
                color="error" 
                onClick={() => { logout(); navigate("/"); }} 
                style={{ marginTop: "20px" }}
            >
                Logout
            </Button>
        </Container>
    );
};

export { Profile };
