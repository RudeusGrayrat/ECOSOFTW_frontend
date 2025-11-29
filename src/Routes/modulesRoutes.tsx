import React from "react";
import { useParams } from "react-router-dom";
import Clientes from "../modules/Comercial/Clientes/Clientes";
import ProtectedComponent from "./ProtectedComponent";
import Cotizaciones from "../modules/Comercial/Cotizaciones/Cotizaciones";
import Parametros_Comercial from "../modules/Comercial/Parametros/Parametros";
import ModulosYSubmodulos from "../modules/Herramientas/ModulosYSubmodulos/ModulosYSubmodulos";
import Proyectos_Comercial from "../modules/Comercial/Proyectos/Proyectos";
import TipoDeGatos_Comercial from "../modules/Comercial/TiposDeGastos/TipoDeGastos";

type ModulesMap = Record<string, Record<string, React.ComponentType<any>>>;

const componentMap: ModulesMap = {
    "comercial": {
        clientes: Clientes,
        cotizaciones: Cotizaciones,
        parametros: Parametros_Comercial,
        proyectos: Proyectos_Comercial,
        "tipos de gastos": TipoDeGatos_Comercial
    },
    "herramientas": {
        "modulos y submodulos": ModulosYSubmodulos
    }

}

const ModulesRoutes: React.FC = () => {
    const { module, submodule } = useParams();

    const moduleComponents = componentMap[module];
    const ComponentToRender = moduleComponents
        ? moduleComponents[submodule]
        : null;
    return (
        <div className="w-full ">
            <ProtectedComponent
                allowedSubmodules={[submodule]}
            >

                {ComponentToRender ? <ComponentToRender /> : <div>Submódulo no encontrado</div>}
            </ProtectedComponent>
        </div>
    );
};

export default ModulesRoutes;
