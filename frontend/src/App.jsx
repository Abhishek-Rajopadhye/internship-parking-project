import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Dashboard }from "./pages/Dashboard";
import { Profile } from "./pages/Profile";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
