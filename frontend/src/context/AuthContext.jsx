import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            const user_id = String(localStorage.getItem("user_id"));
            try {
                const response = await axios.get(`http://localhost:8000/users/profile/${user_id}`,{
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setUser(data);
            } catch (error) {
                setUser(null);
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const login = (provider) => {
        window.location.href = `http://localhost:8000/api/v1/auth/${provider}/login`;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
