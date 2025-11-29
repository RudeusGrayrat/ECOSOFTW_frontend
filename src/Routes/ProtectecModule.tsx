import React from "react";
import { Navigate } from "react-router-dom";
import Loading from "../components/Ui/Loading";
import { useAuth } from "../context/AuthContext";
import useModulesAndSubModules from "../components/SideBar/Links";

type Props = {
    allowedModules?: string[];
    children: React.ReactNode;
};

const ProtectedModule = ({ allowedModules = [], children }: Props) => {
    const { user } = useAuth();
    const { links: userPermissions, loading } = useModulesAndSubModules();

    if (!user) {
        return <div>No autorizado o usuario no encontrado.</div>;
    }
    if (loading) {
        return <Loading />;
    }

    const allowed = allowedModules.map((m) => m.toLowerCase());
    const hasAccess = userPermissions.some((module: any) => {
        const moduleName =
            (module.module || module.name || module.title || "").toString().toLowerCase();
        return allowed.includes(moduleName);
    });

    return hasAccess ? <>{children}</> : <Navigate to="/unauthorized" />;
};

export default ProtectedModule;