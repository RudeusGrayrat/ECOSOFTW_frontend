import { useState } from "react";
import { Button } from "primereact/button";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import PopUp from "../../../../components/Ui/Messages/PopUp";

const ReleaseInformesEnsayo = ({ rowData, reload, permissionReport }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
    const [form, setForm] = useState({
        correoCliente: rowData?.clienteId?.correoElectronico || "",
        asunto: `Informe de ensayo ${rowData?.codigo || ""} liberado`,
        mensaje: "Estimado cliente, su informe de ensayo ya se encuentra disponible para consulta.",
    });
    const sendMessage = useSendMessage();

    const liberar = async () => {
        setDeshabilitar(true);
        try {
            if (!form.correoCliente) {
                sendMessage("Ingresa el correo del cliente para liberar y notificar", "Error");
                return;
            }
            const response = await axios.post(`/operaciones/informes-ensayo/${rowData._id}/liberar`, form);
            sendMessage(response.data.message, response.data.type || "Correcto");
            setShowPanel(false);
            await reload?.();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    if (!permissionReport) return null;

    return (
        <>
            <Button
                icon="pi pi-send"
                title="Liberar informe oficial"
                rounded
                outlined
                disabled={deshabilitar || rowData.estado !== "PRELIMINAR" || rowData.papelera}
                className={`text-blue-500! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl ${rowData.estado !== "PRELIMINAR" || rowData.papelera ? "cursor-not-allowed opacity-30" : ""}`}
                onClick={() => setShowPanel(true)}
            />

            {showPanel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                    <PopUp deshabilitar={deshabilitar} />
                    <div className="w-[680px] max-w-[92vw] rounded-2xl border border-emerald-100 bg-white p-7 shadow-2xl">
                        <div className="mb-5">
                            <h2 className="text-3xl font-bold text-emerald-700">Liberar informe oficial</h2>
                            <p className="mt-2 text-sm font-semibold text-slate-500">
                                Se aplicará firma, QR, ID y marca de acreditación. El correo saldrá desde Calidad y las respuestas llegarán al correo del usuario que libera.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <label className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-700">Correo del cliente</span>
                                <input
                                    value={form.correoCliente}
                                    onChange={(event) => setForm((prev) => ({ ...prev, correoCliente: event.target.value }))}
                                    className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400"
                                    placeholder="cliente@empresa.com"
                                />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-700">Asunto</span>
                                <input
                                    value={form.asunto}
                                    onChange={(event) => setForm((prev) => ({ ...prev, asunto: event.target.value }))}
                                    className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400"
                                />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-700">Mensaje</span>
                                <textarea
                                    value={form.mensaje}
                                    onChange={(event) => setForm((prev) => ({ ...prev, mensaje: event.target.value }))}
                                    rows={4}
                                    className="rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400"
                                />
                            </label>
                            <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                                <p>Código: {rowData.codigo}</p>
                                <p>Plan: {rowData.planMonitoreo || "-"}</p>
                                <p>ID de acceso: {rowData.idAcceso}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <ButtonOk type="cancel" onClick={() => setShowPanel(false)} classe="!w-32" children="Cancelar" />
                            <ButtonOk type="ok" onClick={liberar} classe="!w-40" children="Liberar" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ReleaseInformesEnsayo;
