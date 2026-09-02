import { useState } from "react";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosGenerales from "./DatosGenerales";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import PopUp from "../../../../components/Ui/Messages/PopUp";

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

            const response = await axios.post("/operaciones/informes-ensayo/procesar", dataForm, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            resetForm();
            const conflicts = response.data.conflicts?.length ? ` (${response.data.conflicts.length} con conflicto)` : "";
            sendMessage(`${response.data.message}${conflicts}`, "Correcto");
        } catch (error) {
            if (error?.response?.status === 409 && error.response.data?.exists) {
                setPendingReplace(error.response.data.data);
                sendMessage(error.response.data.message, "Error");
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
                    <span className="font-semibold text-orange-700">
                        El informe {pendingReplace.codigo} ya existe. Versión actual: {pendingReplace.versionActual}. ¿Deseas reemplazarlo?
                    </span>
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
