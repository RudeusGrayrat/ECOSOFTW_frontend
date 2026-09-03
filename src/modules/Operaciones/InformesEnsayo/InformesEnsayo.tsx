import ReadOrCreate from "../../../components/Principal/Principal";
import ListInformesEnsayo from "./List/List";
import RegisterInformesEnsayo from "./Register/Register";
import ReporteInformesEnsayo from "./Reporte/Reporte";

const InformesEnsayo = () => {
    return (
        <ReadOrCreate
            ItemList={ListInformesEnsayo}
            ItemRegister={RegisterInformesEnsayo}
            ItemReporte={ReporteInformesEnsayo}
            submodule="INFORMES DE ENSAYO" />
    )
};

export default InformesEnsayo;
