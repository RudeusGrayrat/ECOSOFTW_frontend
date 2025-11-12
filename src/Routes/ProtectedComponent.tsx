import { Navigate } from "react-router-dom";
import Loading from "../components/Ui/Loading";
import { useAuth } from "../context/AuthContext";
import useModulesAndSubModules from "../components/SideBar/Links";

const ProtectedComponent = ({ allowedSubmodules, children }) => {
    const { user } = useAuth();
    const { links: userPermissions, loading } = useModulesAndSubModules();
    if (!user) {
        return <div>No autorizado o usuario no encontrado.</div>;
    }
    if (loading) {
        return <Loading />;
    }
    const hasAccess = userPermissions.some((module) =>
        module.submodule.some((submodule) =>
            allowedSubmodules.includes(submodule.toLowerCase())
        )
    );
    return hasAccess ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedComponent;
