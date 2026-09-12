import { useState } from "react";
import axios from "../../../../api/axios";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";

const BulkActionsInformesEnsayo = ({
    selectedItems,
    clearSelection,
    reload,
    papelera,
    permissionReport,
    permissionApprove,
    permissionSend,
    permissionDelete,
}) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [showRelease, setShowRelease] = useState(false);
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);
    const [showPurge, setShowPurge] = useState(false);
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
    const isLiberado = (item) => ["LIBERADO", "DISPONIBLE"].includes(item?.estado) && !item?.requiereReprocesarOficial;
    const canApprove = selectedItems.every(isBorrador);
    const canRelease = selectedItems.every((item) => isLiberable(item) && !isLiberado(item) && !item?.papelera);
    const hasOfficial = selectedItems.some(isLiberado);
    const canPurge = papelera && permissionDelete && selectedItems.every((item) => item?.papelera);
    const disabledClass = "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0";
    const actionBaseClass = `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 ${disabledClass}`;

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
            } catch {
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

    const purgeSelected = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.post("/calidad/informes-ensayo/bulk/definitivo", { ids: selectedIds });
            sendMessage(response.data.message, response.data.type || "Correcto");
            setShowPurge(false);
            clearSelection();
            await reload?.();
        } catch (error) {
            sendMessage(await requestErrorMessage(error), "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const handleClearSelection = () => {
        if (papelera && selectedCount > 1 && canPurge) {
            setShowClearConfirmation(true);
            return;
        }
        clearSelection();
    };

    const confirmClearSelection = () => {
        setShowClearConfirmation(false);
        clearSelection();
    };

    const showPurgeConfirmation = () => {
        setShowClearConfirmation(false);
        setShowPurge(true);
    };

    return (
        <>
            <PopUp deshabilitar={deshabilitar} />
            <div className="flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2 shadow-lg shadow-slate-200/70">
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                    <i className="pi pi-check-square text-[0.8rem]" />
                    {selectedCount} seleccionados
                </span>
                {permissionReport && (
                    <>
                        <button
                            className={`${actionBaseClass} bg-slate-50 text-slate-700`}
                            disabled={deshabilitar}
                            onClick={() => requestZip("/calidad/informes-ensayo/bulk/descargar", `informes_seleccionados_${new Date().toISOString().slice(0, 10)}.zip`)}
                        >
                            <i className="pi pi-download text-[0.8rem]" />
                            Todos
                        </button>
                        <button
                            className={`${actionBaseClass} bg-blue-50 text-blue-700`}
                            disabled={deshabilitar || !hasOfficial}
                            data-pr-tooltip={hasOfficial ? "Descargar solo versiones oficiales de la selección" : "Selecciona al menos un informe liberado"}
                            data-pr-position="top"
                            onClick={() => requestZip("/calidad/informes-ensayo/reportes/oficiales", `informes_oficiales_${new Date().toISOString().slice(0, 10)}.zip`)}
                        >
                            <i className="pi pi-file-pdf text-[0.8rem]" />
                            Oficiales
                        </button>
                    </>
                )}
                {permissionApprove && (
                    <button
                        className={`${actionBaseClass} bg-emerald-600 text-white`}
                        disabled={deshabilitar || !canApprove}
                        data-pr-tooltip={canApprove ? "Aprobar borradores seleccionados" : "Para aprobar, selecciona solo informes en BORRADOR sin visto bueno"}
                        data-pr-position="top"
                        onClick={approveSelected}
                    >
                        <i className="pi pi-check text-[0.8rem]" />
                        Aprobar
                    </button>
                )}
                {permissionSend && (
                    <button
                        className={`${actionBaseClass} bg-blue-600 text-white`}
                        disabled={deshabilitar || !canRelease}
                        data-pr-tooltip={canRelease ? "Liberar informes con visto bueno" : "Para liberar, selecciona solo informes preliminares o con visto bueno que aún no estén liberados"}
                        data-pr-position="top"
                        onClick={() => setShowRelease(true)}
                    >
                        <i className="pi pi-send text-[0.8rem]" />
                        Liberar
                    </button>
                )}
                <button
                    className={`${actionBaseClass} bg-slate-100 text-slate-600`}
                    disabled={deshabilitar}
                    data-pr-tooltip="Quitar selecciones"
                    data-pr-position="top"
                    aria-label="Quitar selecciones"
                    onClick={handleClearSelection}
                >
                    <i className="pi pi-times text-[0.8rem]" />
                </button>
                {(!canApprove || !canRelease) && (
                    <span className="max-w-[260px] text-xs font-semibold leading-tight text-amber-700">
                        Algunas acciones se bloquean por estado.
                    </span>
                )}
            </div>

            {showClearConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4" role="dialog" aria-modal="true" aria-labelledby="confirmar-deseleccion-informes">
                    <div className="w-[440px] max-w-[94vw] rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
                        <h2 id="confirmar-deseleccion-informes" className="text-2xl font-black text-slate-800">
                            ¿Seguro que quieres quitar las selecciones?
                        </h2>
                        <p className="mt-3 text-sm font-semibold text-slate-500">
                            Hay {selectedCount} informes seleccionados en la papelera.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <ButtonOk type="cancel" onClick={showPurgeConfirmation} classe="!w-32" children="No" />
                            <ButtonOk type="ok" onClick={confirmClearSelection} classe="!w-32" children="Sí" />
                        </div>
                    </div>
                </div>
            )}

            {showPurge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4" role="dialog" aria-modal="true" aria-labelledby="confirmar-eliminacion-informes">
                    <div className="relative w-[520px] max-w-[94vw] rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
                        {deshabilitar && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/80 text-center backdrop-blur-sm">
                                <i className="pi pi-spin pi-spinner text-4xl text-slate-600" />
                                <p className="mt-4 text-lg font-black text-slate-800">Aplicando limpieza</p>
                            </div>
                        )}
                        <button
                            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition hover:bg-slate-200"
                            disabled={deshabilitar}
                            onClick={() => setShowPurge(false)}
                        >
                            <i className="pi pi-times" />
                        </button>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Papelera</p>
                        <h2 id="confirmar-eliminacion-informes" className="mt-2 pr-10 text-2xl font-black text-slate-800">
                            Eliminar definitivamente {selectedCount} informe{selectedCount === 1 ? "" : "s"}
                        </h2>
                        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
                            Esta acción borra los registros, sus PDFs guardados y las notificaciones relacionadas. No se puede deshacer desde el sistema.
                        </p>
                        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-500">
                            Solo se procesarán informes que estén en papelera. Los demás se omitirán automáticamente.
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <ButtonOk type="cancel" onClick={() => setShowPurge(false)} disabled={deshabilitar} classe="!w-32 disabled:opacity-50" children="Cancelar" />
                            <ButtonOk type="ok" onClick={purgeSelected} disabled={deshabilitar} classe="!w-48 !bg-slate-800 disabled:opacity-60" children="Eliminar definitivamente" />
                        </div>
                    </div>
                </div>
            )}

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
