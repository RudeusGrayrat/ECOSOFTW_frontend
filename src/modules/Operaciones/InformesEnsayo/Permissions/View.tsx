import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewInformesEnsayo = ({ selected, setShowDetail }) => {
    const formatDate = (date) => date ? new Date(date).toLocaleString() : "-";

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

            <div className="mt-7 rounded-2xl bg-white p-5 shadow-lg border border-slate-100">
                <span className="text-2xl font-semibold text-slate-700">Versiones</span>
                <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {selected?.versiones?.length ? selected.versiones.map((version) => (
                        <div key={version.numero} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-lg font-bold text-sky-700">Versión {version.numero}</span>
                                <span className="rounded-full bg-white px-4 py-1 text-sm font-bold text-emerald-700 shadow-inner">
                                    {version.tipo || "BORRADOR"}
                                </span>
                            </div>
                            <p className="mt-3 text-sm font-semibold text-slate-600">
                                <strong>Original: </strong>{version.original?.filename || "-"}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-600">
                                <strong>Procesado: </strong>{version.publicado?.filename || "-"}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-500">
                                {formatDate(version.creadoEn)}
                            </p>
                        </div>
                    )) : (
                        <p className="text-slate-500 font-semibold">Sin versiones registradas.</p>
                    )}
                </div>
            </div>

            <div className="mt-7 rounded-2xl bg-white p-5 shadow-lg border border-slate-100">
                <span className="text-2xl font-semibold text-slate-700">Auditoría</span>
                <div className="mt-4 flex flex-col gap-3">
                    {selected?.auditoria?.length ? selected.auditoria.map((item, index) => (
                        <div key={`${item.accion}-${index}`} className="rounded-xl border-l-4 border-emerald-400 bg-slate-50 px-4 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-bold text-slate-700">{item.accion}</span>
                                <span className="text-sm font-semibold text-slate-500">{formatDate(item.fecha)}</span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-slate-600">{item.detalle || "Sin detalle adicional"}</p>
                        </div>
                    )) : (
                        <p className="text-slate-500 font-semibold">Sin auditoría registrada.</p>
                    )}
                </div>
            </div>
        </Details>
    );
}

export default ViewInformesEnsayo;
