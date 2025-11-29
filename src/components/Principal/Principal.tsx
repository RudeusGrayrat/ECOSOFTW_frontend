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
    const permissionApprove = hasPermission()?.some(
        (permission) => permission === "APROBAR"
    );
    const permissionDisapprove = hasPermission()?.some(
        (permission) => permission === "DESAPROBAR"
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const [change, setChange] = useState(searchParams.get("select") || "");

    useEffect(() => {
        const vistaSeleccionada = searchParams.get("select");

        if (!vistaSeleccionada) {
            if (permissionRead) {
                setChange("Listar");
                setSearchParams({ select: "Listar" });
            } else if (permissionCreate) {
                setChange("Crear");
                setSearchParams({ select: "Crear" });
            } else if (permissionReport) {
                setChange("Reporte");
                setSearchParams({ select: "Reporte" });
            } else {
                setChange("No hay Opciones Disponibles");
                setSearchParams({ select: "No hay Opciones Disponibles" });
            }
        }
    }, [permissionRead, permissionCreate, permissionReport, searchParams]);

    const [options, setOptions] = useState([]);
    useEffect(() => {
        const newOptions = [];
        if (permissionRead) newOptions.push("Listar");
        if (permissionCreate) newOptions.push("Crear");
        if (permissionReport) newOptions.push("Reporte");
        setOptions(newOptions);
    }, [permissionRead, permissionCreate, permissionReport]);

    const handleOptionClick = (option) => {
        setChange(option);
        setSearchParams({ select: option });
    };

    let children;
    if (change === "Crear") {
        children = <ItemRegister />;
    } else if (change === "Listar") {
        children = (
            <ItemList
                permissionRead={permissionRead}
                permissionEdit={permissionEdit}
                permissionDelete={permissionDelete}
                permissionApprove={permissionApprove}
                permissionDisapprove={permissionDisapprove}
            />
        );
    } else if (change === "Reporte") {
        children = <ItemReporte />;
    } else {
        children = "No hay nada";
    }
    useEffect(() => {
        const vistaSeleccionada = searchParams.get("select");
        if (vistaSeleccionada) {
            setChange(vistaSeleccionada);
        }
    }, [searchParams]);

    return (
        <div className="w-full">
            <div className="flex justify-center items-center p-5">
                <RadioOption
                    opciones={options}
                    selectedOption={change}
                    onChange={handleOptionClick}
                />
            </div>
            {children}
        </div>
    );
};

export default ReadOrCreate;
