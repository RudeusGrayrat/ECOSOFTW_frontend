import axios from "../api/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { setMessage } from "../redux/actionError";
import { useDispatch } from "react-redux";
import { verifyToken } from "../api/verifyToken";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {

        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [response, setResponse] = useState(null);

    const signin = async (user) => {
        try {
            const response = await axios.post("/login", user);
            const data = response.data;
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("token_expiry", Date.now() + 24 * 60 * 60 * 1000);
                setUser(data.data);
                setIsAuthenticated(true);
            } else {
                throw new Error("Token no recibido");
            }
        } catch (error) {
            console.error("Signin error:", error);
            setErrors(error?.response?.data?.message);
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem("token");
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            setErrors(error?.response?.data?.message);
        }
    };


    const signup = async (employee) => {
        try {
            const response = await axios.post("/registerUser", employee);
            const data = response.data;
            setResponse(data.message);
        } catch (error) {
            ;
            setErrors(
                error?.response?.data?.message?._message || error?.response?.data?.message
            );
        }
    };
    const updateEmployee = async (employee) => {
        try {
            const response = await axios.patch("/patchEmployee", employee);
            const data = response.data;
            setResponse(data.message);
            return data;
        } catch (error) {
            ;
            setErrors(error?.response?.data?.message);
        }
    };


    useEffect(() => {
        if (errors) {
            console.error("AuthContext error:", errors);
            dispatch(setMessage(errors, "Error"));
        }
        if (response) {
            dispatch(setMessage(response, "Correcto"));
        }
    }, [errors, response]);

    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem("token");
            const expiry = localStorage.getItem("token_expiry");
            if (expiry && Date.now() > expiry) {
                logout();
            }
            if (token) {
                try {
                    const response = await verifyToken(token);
                    if (
                        response?.response?.data?.message === "No se encuentra este usuario"
                    ) {
                        await logout();
                    }
                    if (response?.data) {
                        setUser(response.data);
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    if (error?.response?.data?.message === "Token expirado") {
                        setErrors("Sesión expirada. Por favor, inicie sesión de nuevo.");
                        await logout();
                    }
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setIsLoading(false);
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                signup,
                updateEmployee,
                signin,
                isAuthenticated,
                isLoading,
                logout,
                errors,
                setErrors,
                response,
                setResponse,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
