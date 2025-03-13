import { Button, Container, Typography } from "@mui/material";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);

    return (
        <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
            <Typography variant="h4" gutterBottom>Login to Smart Parking</Typography>
            <Button variant="contained" color="primary" onClick={() => login("google")} style={{ margin: "10px" }}>
                Login with Google
            </Button>
            <Button variant="contained" color="secondary" onClick={() => login("github")} style={{ margin: "10px" }}>
                Login with GitHub
            </Button>
        </Container>
    );
};

export default Login;
