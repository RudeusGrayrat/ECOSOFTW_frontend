import ReadOrCreate from "../../../components/Principal/Principal";
import ListClientesComercial from "./List/List";
import RegisterClientesComercial from "./Register/Register";

const Clientes = () => {
    return (
        <ReadOrCreate
            ItemList={ListClientesComercial}
            ItemRegister={RegisterClientesComercial}
            // ItemReporte={ReporteAsistenciaColaborador}
            submodule="CLIENTES"
        />
    )
};
export default Clientes;