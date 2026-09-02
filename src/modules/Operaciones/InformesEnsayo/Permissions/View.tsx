import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewInformesEnsayo = ({ selected, setShowDetail }) => {
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DEL INFORME</span>
            <div className="flex flex-col flex-wrap overflow-y-hidden mt-4 ml-2">
                <PDetail content="CÓDIGO" value={selected?.codigo} />
                <PDetail content="PLAN DE MONITOREO" value={selected?.planMonitoreo || selected?.pm} />
                <PDetail content="CLIENTE" value={selected?.cliente} />
                <PDetail content="MATRIZ" value={selected?.matriz} />
                <PDetail content="ARCHIVO ORIGINAL" value={selected?.archivoOriginal} />
                <PDetail content="ID DE ACCESO" value={selected?.idAcceso} />
                <PDetail content="ACREDITACIÓN" value={selected?.acreditacion} />
                <PDetail content="TIPO DE VERSIÓN" value={selected?.tipoVersion} />
                <PDetail content="V° B° JEFATURA" value={selected?.vistoBuenoJefatura ? "SI" : "NO"} />
                <PDetail content="ESTADO" value={selected?.estado} />
                <PDetail content="VERSIÓN ACTUAL" value={selected?.versionActual} />
                <PDetail content="URL DE CONSULTA" value={selected?.urlConsulta} />
                <span className="text-2xl font-semibold mt-6">VERSIONES</span>
                {selected?.versiones?.map((version) => (
                    <PDetail
                        key={version.numero}
                        content={`VERSIÓN ${version.numero}`}
                        value={`${version.tipo || "BORRADOR"} - ${version.publicado?.filename || "PDF"}`}
                    />
                ))}
                <span className="text-2xl font-semibold mt-6">AUDITORÍA</span>
                {selected?.auditoria?.map((item, index) => (
                    <PDetail
                        key={`${item.accion}-${index}`}
                        content={item.accion}
                        value={`${item.detalle || ""} ${item.fecha ? new Date(item.fecha).toLocaleString() : ""}`}
                    />
                ))}
            </div>
        </Details>
    );
}

export default ViewInformesEnsayo;
