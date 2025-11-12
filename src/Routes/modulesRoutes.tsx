import React from "react";
import { useParams } from "react-router-dom";
import Clientes from "../modules/Comercial/Clientes/Clientes";
import ProtectedComponent from "./ProtectedComponent";

type ModulesMap = Record<string, Record<string, React.ComponentType<any>>>;

const componentMap: ModulesMap = {
    "comercial": {
        clientes: Clientes
    }
}

const ModulesRoutes: React.FC = () => {
    const { module, submodule } = useParams();

    const moduleComponents = componentMap[module];
    const ComponentToRender = moduleComponents
        ? moduleComponents[submodule]
        : null;
    return (
        <div>
            <ProtectedComponent
                allowedSubmodules={[submodule]}
            >

                {ComponentToRender ? <ComponentToRender /> : <div>Submódulo no encontrado</div>}
            </ProtectedComponent>
        </div>
    );
};

export default ModulesRoutes;
