import ReadOrCreate from "../../../components/Principal/Principal";
import ListCotizacionesComercial from "./List/List";
import RegisterCotizacionesComercial from "./Register/Register";

const Cotizaciones = () => {
    return (
        <ReadOrCreate
            ItemList={ListCotizacionesComercial}
            ItemRegister={RegisterCotizacionesComercial}
            // ItemReporte={ReporteAsistenciaColaborador}
            submodule="COTIZACIONES"
        />
    )
};
export default Cotizaciones;