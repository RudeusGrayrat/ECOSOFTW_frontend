import ReadOrCreate from "../../../components/Principal/Principal";
import ListClientesComercial from "./List/List";

const Clientes = () => {
    return (
        <ReadOrCreate
            ItemList={ListClientesComercial}
            // ItemRegister={RegisterAsistenciaColaborador}
            // ItemReporte={ReporteAsistenciaColaborador}
            submodule="CLIENTES"
        />
    )
};
export default Clientes;