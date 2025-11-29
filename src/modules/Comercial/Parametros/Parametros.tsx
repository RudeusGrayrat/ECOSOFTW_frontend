import ReadOrCreate from "../../../components/Principal/Principal";
import ListParametrosComercial from "./List/List";
import RegisterParametrosComercial from "./Register/Register";

const Parametros_Comercial = () => {
    return (
        <ReadOrCreate
            ItemList={ListParametrosComercial}
            ItemRegister={RegisterParametrosComercial}
            // ItemReporte={ReporteAsistenciaColaborador}
            submodule="PARAMETROS"
        />
    )
}

export default Parametros_Comercial;