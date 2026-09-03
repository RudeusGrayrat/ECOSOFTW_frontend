import { useEffect, useState } from "react";
import axios from "../../../../api/axios";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import PopUp from "../../../../components/Ui/Messages/PopUp";

const initialFilters = {
    search: "",
    codigo: "",
    planMonitoreo: "",
    cliente: "",
    matriz: "",
    acreditacion: "",
};

const ReporteInformesEnsayo = () => {
    const [filters, setFilters] = useState(initialFilters);
    const [data, setData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(25);
    const [total, setTotal] = useState(0);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const update = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value.toUpperCase() }));
    };

    const buscar = async (nextPage = page) => {
        setDeshabilitar(true);
        try {
            const response = await axios.get("/operaciones/informes-ensayo/reportes/oficiales", {
                params: {
                    ...filters,
                    page: nextPage,
                    limit,
                },
            });
            setData(response.data?.data || []);
            setTotal(response.data?.total || 0);
            setPage(nextPage);
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    useEffect(() => {
        buscar(0);
    }, [limit]);

    const toggleSelected = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const togglePage = () => {
        const ids = data.map((item) => item._id);
        const allSelected = ids.length > 0 && ids.every((id) => selectedIds.includes(id));
        setSelectedIds((prev) => {
            if (allSelected) return prev.filter((id) => !ids.includes(id));
            return [...new Set([...prev, ...ids])];
        });
    };

    const limpiar = () => {
        setFilters(initialFilters);
        setData([]);
        setSelectedIds([]);
        setPage(0);
        setTotal(0);
    };

    const descargar = async () => {
        if (!selectedIds.length) {
            sendMessage("Selecciona al menos un informe oficial para descargar", "Error");
            return;
        }

        setDeshabilitar(true);
        try {
            const response = await axios.post(
                "/operaciones/informes-ensayo/reportes/oficiales",
                { ids: selectedIds },
                { responseType: "blob" }
            );
            const url = URL.createObjectURL(new Blob([response.data], { type: "application/zip" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = `informes_oficiales_${new Date().toISOString().slice(0, 10)}.zip`;
            link.click();
            URL.revokeObjectURL(url);
            sendMessage("Reporte descargado correctamente", "Correcto");
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const selectedOnPage = data.length > 0 && data.every((item) => selectedIds.includes(item._id));

    return (
        <div className="mx-auto w-[95%] rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl">
            <PopUp deshabilitar={deshabilitar} />
            <div className="mb-6 flex flex-col gap-2">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-700">Reportes</p>
                <h2 className="text-3xl font-black text-slate-800">Descarga masiva de informes oficiales</h2>
                <p className="max-w-3xl text-sm font-semibold leading-6 text-slate-500">
                    Busca los informes liberados, selecciona solo los que necesitas y descarga un ZIP con los PDFs oficiales.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700">Búsqueda general</span>
                    <input value={filters.search} onChange={(event) => update("search", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400" placeholder="Código, PM, cliente, matriz" />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700">Código</span>
                    <input value={filters.codigo} onChange={(event) => update("codigo", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400" placeholder="260705" />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700">Plan de monitoreo</span>
                    <input value={filters.planMonitoreo} onChange={(event) => update("planMonitoreo", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400" placeholder="004-2607" />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700">Cliente</span>
                    <input value={filters.cliente} onChange={(event) => update("cliente", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400" placeholder="PICCONE ROSALES" />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700">Matriz</span>
                    <input value={filters.matriz} onChange={(event) => update("matriz", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400" placeholder="RUIDO" />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700">Acreditación</span>
                    <select value={filters.acreditacion} onChange={(event) => update("acreditacion", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400">
                        <option value="">TODAS</option>
                        <option value="INACAL">INACAL</option>
                        <option value="NAC">NAC</option>
                        <option value="SIN_ACREDITACION">SIN ACREDITACIÓN</option>
                    </select>
                </label>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800">
                    {selectedIds.length} seleccionados de {total} encontrados
                </div>
                <div className="flex flex-wrap gap-2">
                    <ButtonOk type="cancel" onClick={limpiar} styles="m-0" classe="!w-32" children="Limpiar" />
                    <ButtonOk type="ok" onClick={() => buscar(0)} styles="m-0" classe="!w-32" children="Buscar" />
                    <ButtonOk type="ok" onClick={descargar} styles="m-0" classe="!w-60" children="Descargar seleccionados" />
                </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse text-left text-sm text-slate-700">
                        <thead className="bg-gradient-to-r from-slate-50 to-emerald-50 text-xs uppercase tracking-wide text-blue-900">
                            <tr>
                                <th className="w-14 px-4 py-4 text-center">
                                    <input type="checkbox" checked={selectedOnPage} onChange={togglePage} />
                                </th>
                                <th className="px-4 py-4">Código</th>
                                <th className="px-4 py-4">Plan de monitoreo</th>
                                <th className="px-4 py-4">Cliente</th>
                                <th className="px-4 py-4">Matriz</th>
                                <th className="px-4 py-4">Acreditación</th>
                                <th className="px-4 py-4">ID Acceso</th>
                                <th className="px-4 py-4">Archivo oficial</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length ? data.map((item) => (
                                <tr key={item._id} className={`border-t border-slate-100 ${selectedIds.includes(item._id) ? "bg-emerald-50/70" : "bg-white"}`}>
                                    <td className="px-4 py-3 text-center">
                                        <input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggleSelected(item._id)} />
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-800">{item.codigo || "-"}</td>
                                    <td className="px-4 py-3">{item.planMonitoreo || "-"}</td>
                                    <td className="px-4 py-3">{item.cliente || "-"}</td>
                                    <td className="px-4 py-3">{item.matriz || "-"}</td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-xl bg-slate-100 px-3 py-1 font-bold text-emerald-700">
                                            {item.acreditacion?.replace("_", " ") || "-"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs font-bold">{item.idAcceso || "-"}</td>
                                    <td className="px-4 py-3 font-semibold text-blue-900">{item.archivo || "-"}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td className="px-4 py-10 text-center font-semibold text-slate-400" colSpan={8}>
                                        Busca informes oficiales para seleccionar los PDFs que quieres descargar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4">
                    <span className="text-sm font-semibold text-slate-500">
                        Página {page + 1} de {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-600 disabled:opacity-40" disabled={page === 0} onClick={() => buscar(page - 1)}>
                            Anterior
                        </button>
                        <select value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-600">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <button className="rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-600 disabled:opacity-40" disabled={page + 1 >= totalPages} onClick={() => buscar(page + 1)}>
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReporteInformesEnsayo;
