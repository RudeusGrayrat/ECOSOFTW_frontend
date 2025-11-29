import React from "react";
import { useParams } from "react-router-dom";
import Clientes from "../modules/Comercial/Clientes/Clientes";
import ProtectedComponent from "./ProtectedComponent";
import Cotizaciones from "../modules/Comercial/Cotizaciones/Cotizaciones";
import Parametros_Comercial from "../modules/Comercial/Parametros/Parametros";
import ModulosYSubmodulos from "../modules/Herramientas/ModulosYSubmodulos/ModulosYSubmodulos";
import Comercial from "../modules/Comercial/Comercial";
import ProtectedModule from "./ProtectecModule";
import Operaciones from "../modules/Operaciones/Operaciones";

type ModulesMap = Record<string, Record<string, React.ComponentType<any>>>;

const componentMap: ModulesMap = {
    "comercial": Comercial,
    "operaciones": Operaciones
}

const ModuleRoute: React.FC = () => {
    const { module, } = useParams();

    const moduleComponents = componentMap[module];
    const ComponentToRender = moduleComponents
    return (
        <div className="w-full ">
            <ProtectedModule allowedModules={[module || ""]}>
                {ComponentToRender ? <ComponentToRender /> : <div>Submódulo no encontrado</div>}
            </ProtectedModule>
        </div>
    );
};

export default ModuleRoute;
