import { useContext, useEffect, useState } from "react";
import { Container, Typography, Avatar, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:8000/profile");
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) return <Typography variant="h5">Loading profile...</Typography>;

    return (
        <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
            <Avatar 
                src={profile.profile_picture} 
                alt={profile.name} 
                sx={{ width: 100, height: 100, margin: "auto" }} 
            />
            <Typography variant="h4">{profile.name}</Typography>
            <Typography variant="h6">{profile.email}</Typography>
            <Typography variant="h6">{profile.phone || "Not provided"}</Typography>
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
