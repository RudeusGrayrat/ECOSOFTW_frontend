import { useState } from "react";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosGenerales from "./DatosGenerales";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import PopUp from "../../../../components/Ui/Messages/PopUp";

const MAX_BATCH_MB = Number(import.meta.env.VITE_INFORMES_UPLOAD_BATCH_SIZE_MB || 100);

const RegisterInformesEnsayo = () => {
    const [form, setForm] = useState({ tipoPlantilla: "SIN_ACREDITACION" });
    const [files, setFiles] = useState([]);
    const [pendingReplace, setPendingReplace] = useState(null);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const resetForm = () => {
        setForm({ tipoPlantilla: "SIN_ACREDITACION" });
        setFiles([]);
        setPendingReplace(null);
    }

    const registrar = async (reemplazar = false) => {
        setDeshabilitar(true);
        try {
            if (!files.length) {
                sendMessage("Selecciona uno o varios PDF del informe", "Error");
                return;
            }
            const totalBytes = files.reduce((sum, item) => sum + Number(item.file?.size || 0), 0);
            const totalMb = totalBytes / 1024 / 1024;
            if (totalMb > MAX_BATCH_MB) {
                sendMessage(`La carga pesa ${totalMb.toFixed(1)} MB. Sube menos archivos por lote o aumenta el límite del servidor.`, "Error");
                return;
            }
            const invalid = files.find((item) => !item.codigo || !item.planMonitoreo || !item.matriz);
            if (invalid) {
                sendMessage(`Revisa los datos detectados de ${invalid.file?.name || "un archivo"}`, "Error");
                return;
            }

            const dataForm = new FormData();
            files.forEach((item) => dataForm.append("archivos", item.file));
            dataForm.append("metadata", JSON.stringify(files.map((item) => ({
                filename: item.file.name,
                codigo: item.codigo,
                planMonitoreo: item.planMonitoreo,
                cliente: item.cliente,
                matriz: item.matriz,
            }))));
            dataForm.append("tipoPlantilla", form.tipoPlantilla || "SIN_ACREDITACION");
            dataForm.append("reemplazar", reemplazar ? "true" : "false");

            const response = await axios.post("/calidad/informes-ensayo/procesar", dataForm, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            resetForm();
            const conflicts = response.data.conflicts?.length ? ` (${response.data.conflicts.length} con conflicto)` : "";
            const conflictDetail = response.data.conflicts
                ?.map((item) => item.message || `${item.codigo || item.archivo} ya existe`)
                .filter(Boolean)
                .join(" | ");
            sendMessage(`${response.data.message}${conflicts}`, "Correcto");
            if (conflictDetail) sendMessage(conflictDetail, "Advertencia");
        } catch (error) {
            const responseData = error?.response?.data;
            if (error?.response?.status === 409 && error.response.data?.exists) {
                setPendingReplace(responseData.conflicts || responseData.data);
                sendMessage(responseData.message, "Error");
                return;
            }
            if (responseData?.conflicts?.length) {
                const detail = responseData.conflicts
                    .map((item) => item.message || `${item.codigo || item.archivo || "Archivo"} no se pudo cargar`)
                    .filter(Boolean)
                    .join(" | ");
                sendMessage(`${responseData.message}${detail ? `: ${detail}` : ""}`, responseData.type || "Error");
                return;
            }
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return (
        <div>
            <PopUp deshabilitar={deshabilitar} />
            {pendingReplace && (
                <div className="mx-8 mt-4 p-4 border border-orange-200 bg-orange-50 rounded-lg flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-orange-700">
                            {Array.isArray(pendingReplace) && pendingReplace.length > 1
                                ? `${pendingReplace.length} informes ya existen. ¿Deseas reemplazarlos todos?`
                                : `El informe ${(Array.isArray(pendingReplace) ? pendingReplace[0]?.codigo : pendingReplace.codigo)} ya existe. ¿Deseas reemplazarlo?`}
                        </span>
                        {Array.isArray(pendingReplace) && pendingReplace.length > 1 && (
                            <span className="max-w-4xl text-xs font-semibold text-orange-600">
                                {pendingReplace.map((item) => item.codigo || item.archivo).filter(Boolean).join(", ")}
                            </span>
                        )}
                    </div>
                    <div className="flex">
                        <ButtonOk type="ok" onClick={() => registrar(true)} classe="!w-28" children="SI" />
                        <ButtonOk type="cancel" onClick={() => setPendingReplace(null)} classe="!w-28" children="NO" />
                    </div>
                </div>
            )}
            <CardPlegable title="Procesar Informe de Ensayo" >
                <DatosGenerales form={form} setForm={setForm} files={files} setFiles={setFiles} />
            </CardPlegable>
            <div className="flex flex-col mx-5">
                <div className="flex justify-center m-10 ">
                    <ButtonOk type="ok" onClick={() => registrar(false)} classe="!w-80" children="Cargar Borrador" />
                </div>
            </div>
        </div>
    )
};

export default RegisterInformesEnsayo;
