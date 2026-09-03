import { useState } from "react";
import axios from "../../../../api/axios";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";

const BulkActionsInformesEnsayo = ({
    selectedItems,
    clearSelection,
    reload,
    permissionReport,
    permissionApprove,
    permissionSend,
}) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [showRelease, setShowRelease] = useState(false);
    const [releaseForm, setReleaseForm] = useState({
        enviarCorreo: false,
        correoCliente: "",
        asunto: "Informes de ensayo liberados",
        mensaje: "Estimado cliente, sus informes de ensayo ya se encuentran disponibles para consulta.",
    });
    const sendMessage = useSendMessage();
    const selectedIds = selectedItems.map((item) => item._id);
    const selectedCount = selectedIds.length;
    const normalizeEstado = (item) => item?.papelera ? "PAPELERA" : (item?.estado === "DISPONIBLE" ? "LIBERADO" : item?.estado);
    const isBorrador = (item) => normalizeEstado(item) === "BORRADOR" && !item?.vistoBuenoJefatura;
    const isLiberable = (item) => ["PRELIMINAR"].includes(normalizeEstado(item)) || item?.vistoBuenoJefatura;
    const isLiberado = (item) => ["LIBERADO", "DISPONIBLE"].includes(item?.estado);
    const canApprove = selectedItems.every(isBorrador);
    const canRelease = selectedItems.every((item) => isLiberable(item) && !isLiberado(item) && !item?.papelera);
    const hasOfficial = selectedItems.some(isLiberado);
    const disabledClass = "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0";

    if (!selectedCount) return null;

    const downloadBlob = (data, filename) => {
        const url = URL.createObjectURL(new Blob([data], { type: "application/zip" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const requestErrorMessage = async (error) => {
        const data = error?.response?.data;
        if (data instanceof Blob) {
            const text = await data.text();
            try {
                return JSON.parse(text)?.message || text || error.message;
            } catch (_) {
                return text || error.message;
            }
        }
        return data?.message || error?.message || "No se pudo completar la acción";
    };

    const requestZip = async (url, filename) => {
        setDeshabilitar(true);
        try {
            const response = await axios.post(url, { ids: selectedIds }, { responseType: "blob" });
            downloadBlob(response.data, filename);
            sendMessage("Descarga generada correctamente", "Correcto");
        } catch (error) {
            sendMessage(await requestErrorMessage(error), "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const approveSelected = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.post("/calidad/informes-ensayo/bulk/aprobar", { ids: selectedIds });
            sendMessage(response.data.message, response.data.type || "Correcto");
            clearSelection();
            await reload?.();
        } catch (error) {
            sendMessage(await requestErrorMessage(error), "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const releaseSelected = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.post("/calidad/informes-ensayo/bulk/liberar", {
                ids: selectedIds,
                ...releaseForm,
            });
            sendMessage(response.data.message, response.data.type || "Correcto");
            setShowRelease(false);
            clearSelection();
            await reload?.();
        } catch (error) {
            sendMessage(await requestErrorMessage(error), "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    return (
        <>
            <PopUp deshabilitar={deshabilitar} />
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 shadow-inner">
                <span className="px-2 text-sm font-black text-emerald-800">
                    {selectedCount} seleccionados
                </span>
                {permissionReport && (
                    <>
                        <button
                            className={`rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-700 shadow transition hover:-translate-y-0.5 ${disabledClass}`}
                            disabled={deshabilitar}
                            onClick={() => requestZip("/calidad/informes-ensayo/bulk/descargar", `informes_seleccionados_${new Date().toISOString().slice(0, 10)}.zip`)}
                        >
                            Descargar todos
                        </button>
                        <button
                            className={`rounded-xl bg-white px-3 py-2 text-xs font-black text-blue-700 shadow transition hover:-translate-y-0.5 ${disabledClass}`}
                            disabled={deshabilitar || !hasOfficial}
                            title={hasOfficial ? "Descargar solo versiones oficiales de la selección" : "Selecciona al menos un informe liberado"}
                            onClick={() => requestZip("/calidad/informes-ensayo/reportes/oficiales", `informes_oficiales_${new Date().toISOString().slice(0, 10)}.zip`)}
                        >
                            Descargar oficiales
                        </button>
                    </>
                )}
                {permissionApprove && (
                    <button
                        className={`rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow transition hover:-translate-y-0.5 ${disabledClass}`}
                        disabled={deshabilitar || !canApprove}
                        title={canApprove ? "Aprobar borradores seleccionados" : "Para aprobar, selecciona solo informes en BORRADOR sin visto bueno"}
                        onClick={approveSelected}
                    >
                        Aprobar
                    </button>
                )}
                {permissionSend && (
                    <button
                        className={`rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white shadow transition hover:-translate-y-0.5 ${disabledClass}`}
                        disabled={deshabilitar || !canRelease}
                        title={canRelease ? "Liberar informes con visto bueno" : "Para liberar, selecciona solo informes preliminares o con visto bueno que aún no estén liberados"}
                        onClick={() => setShowRelease(true)}
                    >
                        Liberar
                    </button>
                )}
                <button
                    className={`rounded-xl bg-slate-200 px-3 py-2 text-xs font-black text-slate-600 shadow transition hover:-translate-y-0.5 ${disabledClass}`}
                    disabled={deshabilitar}
                    onClick={clearSelection}
                >
                    Quitar selección
                </button>
                {(!canApprove || !canRelease) && (
                    <span className="text-xs font-semibold text-amber-700">
                        Las acciones se activan solo cuando toda la selección cumple el estado requerido.
                    </span>
                )}
            </div>

            {showRelease && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                    <div className="relative w-[680px] max-w-[92vw] rounded-2xl border border-emerald-100 bg-white p-7 shadow-2xl">
                        {deshabilitar && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/80 text-center backdrop-blur-sm">
                                <i className="pi pi-spin pi-spinner text-4xl text-emerald-600" />
                                <p className="mt-4 text-lg font-black text-slate-800">Liberando informes</p>
                                <p className="mt-1 max-w-md text-sm font-semibold text-slate-500">
                                    Estamos generando los PDFs oficiales{releaseForm.enviarCorreo ? " y enviando correos" : ""}.
                                </p>
                            </div>
                        )}
                        <h2 className="text-3xl font-bold text-emerald-700">Liberar informes seleccionados</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Se liberarán {selectedCount} informes. El correo es opcional; si no lo activas, solo quedarán oficiales y consultables.
                        </p>

                        <label className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 font-bold text-slate-700">
                            <input
                                type="checkbox"
                                checked={releaseForm.enviarCorreo}
                                onChange={(event) => setReleaseForm((prev) => ({ ...prev, enviarCorreo: event.target.checked }))}
                            />
                            Enviar correo a los clientes después de liberar
                        </label>

                        {releaseForm.enviarCorreo && (
                            <div className="mt-4 grid gap-4">
                                <label className="flex flex-col gap-1">
                                    <span className="font-semibold text-slate-700">Correo alternativo</span>
                                    <input
                                        value={releaseForm.correoCliente}
                                        onChange={(event) => setReleaseForm((prev) => ({ ...prev, correoCliente: event.target.value }))}
                                        className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400"
                                        placeholder="Opcional si el cliente no tiene correo registrado"
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className="font-semibold text-slate-700">Asunto</span>
                                    <input
                                        value={releaseForm.asunto}
                                        onChange={(event) => setReleaseForm((prev) => ({ ...prev, asunto: event.target.value }))}
                                        className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400"
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className="font-semibold text-slate-700">Mensaje</span>
                                    <textarea
                                        value={releaseForm.mensaje}
                                        onChange={(event) => setReleaseForm((prev) => ({ ...prev, mensaje: event.target.value }))}
                                        rows={4}
                                        className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400"
                                    />
                                </label>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <ButtonOk type="cancel" onClick={() => setShowRelease(false)} disabled={deshabilitar} classe="!w-32 disabled:opacity-50" children="Cancelar" />
                            <ButtonOk type="ok" onClick={releaseSelected} disabled={deshabilitar} classe="!w-52 disabled:opacity-60" children={releaseForm.enviarCorreo ? "Liberar y enviar" : "Liberar"} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BulkActionsInformesEnsayo;
