import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewInformesEnsayo = ({ selected, setShowDetail }) => {
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DEL INFORME</span>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100">
                    <span className="text-xl font-bold text-emerald-700">Resumen</span>
                    <div className="mt-3">
                        <PDetail content="CÓDIGO" value={selected?.codigo} />
                        <PDetail content="PLAN DE MONITOREO" value={selected?.planMonitoreo || selected?.pm} />
                        <PDetail content="CLIENTE" value={selected?.cliente} />
                        <PDetail content="MATRIZ" value={selected?.matriz} />
                        <PDetail content="ID DE ACCESO" value={selected?.idAcceso} />
                        <PDetail content="ACREDITACIÓN" value={selected?.acreditacion} />
                        <PDetail content="ESTADO" value={selected?.estado} />
                        <PDetail content="V° B° JEFATURA" value={selected?.vistoBuenoJefatura ? "SI" : "NO"} />
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100">
                    <span className="text-xl font-bold text-emerald-700">Consulta</span>
                    <div className="mt-3">
                        <PDetail content="VERSIÓN ACTUAL" value={selected?.tipoVersion || "-"} />
                        <PDetail content="ARCHIVO ORIGINAL" value={selected?.archivoOriginal || "-"} />
                        <PDetail content="ARCHIVO ACTUAL" value={selected?.archivoGenerado || "-"} />
                        <PDetail content="URL DE CONSULTA" value={selected?.urlConsulta} />
                    </div>
                </div>
            </div>
        </Details>
    );
}

export default ViewInformesEnsayo;
