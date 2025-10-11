// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// same logic you use in App.js
const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://jewelry-inventory-client-backend.onrender.com";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null); // "admin" | "staff" | "guest" | null
    const [loading, setLoading] = useState(true);

    // Load from localStorage on first paint
    useEffect(() => {
        const savedToken = localStorage.getItem("auth_token");
        const savedRole = localStorage.getItem("auth_role");
        if (savedToken) {
            setToken(savedToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        }
        if (savedRole) setRole(savedRole);
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
        const { token: t, role: r } = res.data || {};
        setToken(t);
        setRole(r);
        // persist
        localStorage.setItem("auth_token", t);
        localStorage.setItem("auth_role", r);
        // attach for all future axios calls
        axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        return { role: r };
    };

    const continueAsGuest = () => {
        // clear any existing token & set role=guest
        setToken(null);
        setRole("guest");
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("auth_token");
        localStorage.setItem("auth_role", "guest");
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_role");
    };

    const value = useMemo(
        () => ({
            token,
            role,                // "admin" | "staff" | "guest" | null
            isAuthenticated: !!token || role === "guest",
            isAdmin: role === "admin",
            isStaff: role === "staff",
            isGuest: role === "guest",
            login,
            continueAsGuest,
            logout,
            loading,
            API_BASE_URL,
        }),
        [token, role, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
