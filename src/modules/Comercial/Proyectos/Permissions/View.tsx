import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewProyectos = ({ setShowDetail, selected }) => {
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DEL PROYECTO</span>

            <div className="flex flex-col flex-wrap overflow-y-hidden mt-4 ml-2">
                <PDetail content="NOMBRE DEL PROYECTO" value={selected?.nombre} />
                <PDetail content="CLIENTE" value={selected?.cliente_id?.cliente} />
                <PDetail content="RUC / DNI" value={selected?.cliente_id?.numeroDocumento} />
                <PDetail content="TIPO DE CLIENTE" value={selected?.cliente_id?.tipoCliente} />
                <PDetail content="SERVICIO" value={selected?.servicio} />
                <PDetail content="FECHA DE SERVICIO" value={selected?.fechaServicio} />
                <PDetail content="LUGAR DE MUESTREO" value={selected?.lugarMuestreo} />
                <PDetail content="CANTIDAD DE PUNTOs / PARAMETROS" value={selected?.cantidadPuntosParametros} />
                <PDetail content="ESTADO" value={selected?.estado} />
            </div>
        </Details>
    )
}

export default ViewProyectos;