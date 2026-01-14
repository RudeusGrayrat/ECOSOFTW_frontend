import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "./components/Ui/Loading";
import Circuite from "./components/Ui/Loading/Circuite";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            setShowLoading(true); // Siempre mostrar loading cuando `isLoading` es true
        } else {
            const timer = setTimeout(() => {
                setShowLoading(false); // Mantener el loading por 1 segundo antes de ocultarlo
            }, 2000);
            return () => clearTimeout(timer); // Limpiar timeout si cambia rápido
        }
    }, [isLoading]);

    if (showLoading) return <Loading/>; // Se mantiene visible 1s después de que `isLoading` sea false

    if (!isAuthenticated) {
        localStorage.setItem("lastRoute", location.pathname);
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
