import React from "react";
import { useParams } from "react-router-dom";
import Comercial from "../modules/Comercial/Comercial";
import ProtectedModule from "./ProtectecModule";
import Operaciones from "../modules/Operaciones/Operaciones";
import Herramientas from "../modules/Herramientas/Herramientas";

type ModulesMap = Record<string, React.ComponentType<any>>;

const componentMap: ModulesMap = {
    "comercial": Comercial,
    "herramientas": Herramientas,
    "operaciones": Operaciones
}

const ModuleRoute: React.FC = () => {
    const { module } = useParams();

    const ComponentToRender = module ? componentMap[module] : null;
    return (
        <div className="w-full ">
            <ProtectedModule allowedModules={[module || ""]}>
                {ComponentToRender ? <ComponentToRender /> : <div>Submódulo no encontrado</div>}
            </ProtectedModule>
        </div>
    );
};

export default ModuleRoute;
