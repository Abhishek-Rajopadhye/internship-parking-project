import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://localhost:8000/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
        }
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
