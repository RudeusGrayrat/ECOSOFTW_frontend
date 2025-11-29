import ReadOrCreate from "../../../components/Principal/Principal";
import ListTiposDeGastos from "./List/List";
import RegisterTiposDeGastos from "./Register/Register";

const TipoDeGatos_Comercial = () => {
    return (
        <ReadOrCreate
            ItemList={ListTiposDeGastos}
            ItemRegister={RegisterTiposDeGastos}
            submodule="TIPOS DE GASTOS" />
    )
};

export default TipoDeGatos_Comercial;