import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box } from "@mui/material";

const EditProfileModal = ({ open, handleClose, user, handleSave }) => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        profile_picture: "",
        total_earnings: 0,
    });

    useEffect(() => {
        if (user) {
            const user_id = String(localStorage.getItem("user_id"));
            setFormData({
                id: user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profile_picture: user.profile_picture,
                total_earnings: user.total_earnings
            });
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSave(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Profile Picture URL"
                        name="profile_picture"
                        value={formData.profile_picture}
                        onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Save
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export { EditProfileModal };