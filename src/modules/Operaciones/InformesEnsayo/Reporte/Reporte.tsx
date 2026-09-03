import { useState } from "react";
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
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const update = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value.toUpperCase() }));
    };

    const descargar = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.post("/operaciones/informes-ensayo/reportes/oficiales", filters, {
                responseType: "blob",
            });
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

    return (
        <div className="mx-auto w-[95%] rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl">
            <PopUp deshabilitar={deshabilitar} />
            <div className="mb-6">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-700">Reportes</p>
                <h2 className="mt-2 text-3xl font-black text-slate-800">Descarga masiva de informes oficiales</h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
                    Esta descarga solo incluye informes liberados/oficiales. Los borradores y preliminares se omiten automáticamente.
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

            <div className="mt-8 flex flex-wrap justify-end gap-2">
                <ButtonOk type="cancel" onClick={() => setFilters(initialFilters)} classe="!w-36" children="Limpiar" />
                <ButtonOk type="ok" onClick={descargar} classe="!w-64" children="Descargar oficiales" />
            </div>
        </div>
    );
};

export default ReporteInformesEnsayo;
