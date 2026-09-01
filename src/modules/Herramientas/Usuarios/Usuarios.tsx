import ReadOrCreate from "../../../components/Principal/Principal";
import ListUsuarios from "./List/List";
import RegisterUsuarios from "./Register/Register";

const Usuarios_Herramientas = () => {
    return (
        <ReadOrCreate
            ItemList={ListUsuarios}
            ItemRegister={RegisterUsuarios}
            submodule="USUARIOS" />
    )
};

export default Usuarios_Herramientas;
