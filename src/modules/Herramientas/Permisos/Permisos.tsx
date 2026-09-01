import ReadOrCreate from "../../../components/Principal/Principal";
import ListPermisos from "./List/List";
import RegisterPermisos from "./Register/Register";

const Permisos_Herramientas = () => {
    return (
        <ReadOrCreate
            ItemList={ListPermisos}
            ItemRegister={RegisterPermisos}
            submodule="PERMISOS" />
    )
};

export default Permisos_Herramientas;
