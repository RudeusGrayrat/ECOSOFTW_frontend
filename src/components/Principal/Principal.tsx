import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RadioOption from "../Ui/Button/Radio";
import { useAuth } from "../../context/AuthContext";

const ReadOrCreate = ({ ItemRegister, ItemList, ItemReporte, submodule }) => {
    const { user } = useAuth();

    const hasPermission = () => {
        if (user) {
            const { modules } = user;

            const hasPermission1 = modules?.filter(
                (module) => module.submodule?.name === submodule
            );
            const hasPermission2 = hasPermission1[0]?.submodule?.permissions;
            return hasPermission2;
        }
    };

    const permissionCreate = hasPermission()?.some(
        (permission) => permission === "CREAR"
    );
    const permissionRead = hasPermission()?.some(
        (permission) => permission === "VER"
    );
    const permissionEdit = hasPermission()?.some(
        (permission) => permission === "EDITAR"
    );
    const permissionDelete = hasPermission()?.some(
        (permission) => permission === "ELIMINAR"
    );
    const permissionReport = hasPermission()?.some(
        (permission) => permission === "REPORTAR"
    );
    const permissionSend = hasPermission()?.some(
        (permission) => permission === "ENVIAR"
    );
    const permissionApprove = hasPermission()?.some(
        (permission) => permission === "APROBAR"
    );
    const permissionDisapprove = hasPermission()?.some(
        (permission) => permission === "DESAPROBAR"
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedView = searchParams.get("select");

    const defaultView = () => {
        if (permissionRead) return "Listar";
        if (permissionCreate) return "Crear";
        if (permissionReport && ItemReporte) return "Reporte";
        return "";
    };

    useEffect(() => {
        const vistaSeleccionada = searchParams.get("select");
        const availableViews = [];
        if (permissionRead) availableViews.push("Listar");
        if (permissionCreate) availableViews.push("Crear");
        if (permissionReport && ItemReporte) availableViews.push("Reporte");

        if (!vistaSeleccionada || !availableViews.includes(vistaSeleccionada)) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                const nextView = defaultView();
                if (nextView) params.set("select", nextView);
                params.delete("view");
                return params;
            });
        }
    }, [permissionRead, permissionCreate, permissionReport, ItemReporte, submodule]);

    const [options, setOptions] = useState([]);
    useEffect(() => {
        const newOptions = [];
        if (permissionRead) newOptions.push("Listar");
        if (permissionCreate) newOptions.push("Crear");
        if (permissionReport && ItemReporte) newOptions.push("Reporte");
        setOptions(newOptions);
    }, [permissionRead, permissionCreate, permissionReport, ItemReporte]);

    const handleOptionClick = (option) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("select", option);
            params.delete("view"); // opcional: limpiar view al cambiar pestaña
            return params;
        });
    };

    let children;

    if (selectedView === "Crear") {
        children = <ItemRegister />;
    } else if (selectedView === "Listar") {
        children = <ItemList
            permissionRead={permissionRead}
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionReport={permissionReport}
            permissionSend={permissionSend}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
        />
    }
    else if (selectedView === "Reporte") {
        children = ItemReporte ? <ItemReporte permissionReport={permissionReport} /> : null;
    }

    return (
        <div className="w-full">
            <div className="flex justify-center items-center p-5">
                <RadioOption
                    opciones={options}
                    selectedOption={selectedView}
                    onChange={handleOptionClick}
                />

            </div>
            {children}
        </div>
    );
};

export default ReadOrCreate;
