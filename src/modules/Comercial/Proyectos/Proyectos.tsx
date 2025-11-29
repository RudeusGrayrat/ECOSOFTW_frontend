import ReadOrCreate from "../../../components/Principal/Principal";
import ListProyectos from "./List/List";
import RegisterProyectos from "./Register/Register";

const Proyectos_Comercial = () => {
    return <ReadOrCreate
        ItemList={ListProyectos}
        ItemRegister={RegisterProyectos}
        submodule="PROYECTOS" />;
};

export default Proyectos_Comercial;