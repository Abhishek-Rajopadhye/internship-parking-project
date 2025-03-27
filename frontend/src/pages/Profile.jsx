import { useContext, useState } from "react";
import { Container, Typography, Avatar, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { EditProfileModal } from "../components/EditProfileModal";
import axios from "axios";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        const user_id = String(localStorage.getItem("user_id"));
        try {
            const response = await axios.get(`http://localhost:8000/users/profile/${user_id}`,{
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;
            data.id = user_id;
            setUser(data);
        } catch (error) {
            setUser(null);
            console.error("Error fetching profile:", error);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async (updatedUser) => {
        try {
            const user_id = String(localStorage.getItem("user_id"));
            const response = await axios.put(`http://localhost:8000/users/profile/${user_id}`, updatedUser, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status !== 200) {
                throw new Error("Failed to update profile");
            }

            // Update user context or state here if needed
            handleCloseModal();
            fetchProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!user) return <Typography variant="h5">Loading profile...</Typography>;

    return (
        <Container sx={{ textAlign: "center", mt: 10, mr:50 }}>
            <Avatar 
                src={user.profile_picture} 
                alt={user.name} 
                sx={{ width: 100, height: 100, margin: "auto" }} 
            />
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="h6">{user.email}</Typography>
            <Typography variant="h6">Ph.No: {user.phone || "Not provided"}</Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenModal} 
                style={{ marginTop: "20px" }}
            >
                Edit Profile
            </Button>
            <EditProfileModal 
                open={isModalOpen} 
                handleClose={handleCloseModal} 
                user={user} 
                handleSave={handleSave} 
            />
        </Container>
    );
};

export { Profile };
