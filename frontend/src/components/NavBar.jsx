import { Box, Avatar, Typography, Button, Divider, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, logout }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: 310,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRight: "1px solid #ddd",
                padding: 2,
            }}
        >
            <Box>
                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                    <Avatar 
                        src={user.profile_picture} 
                        alt={user.name} 
                        sx={{ width: 100, height: 100, margin: "auto" }} 
                    />
                    <Typography variant="h6">{user.name}</Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem button onClick={() => navigate("/profile")}>
                        <ListItemText primary="User Profile" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/booking-history")}>
                        <ListItemText primary="My Booking History" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/my-spots")}>
                        <ListItemText primary="My Spots" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/home")}>
                        <ListItemText primary="Home" />
                    </ListItem>
                </List>
            </Box>
            <Box>
                <Divider />
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={logout} 
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
};
export { NavBar };