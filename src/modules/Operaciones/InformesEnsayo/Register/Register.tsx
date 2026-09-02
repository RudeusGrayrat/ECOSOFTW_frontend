import { useState } from "react";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosGenerales from "./DatosGenerales";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import ConfiguracionDocumental from "./ConfiguracionDocumental";

const RegisterInformesEnsayo = () => {
    const [form, setForm] = useState({ tipoPlantilla: "SIN_ACREDITACION", motivo: "" });
    const [file, setFile] = useState(null);
    const [pendingReplace, setPendingReplace] = useState(null);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const resetForm = () => {
        setForm({ tipoPlantilla: "SIN_ACREDITACION", motivo: "" });
        setFile(null);
        setPendingReplace(null);
    }

    const registrar = async (reemplazar = false) => {
        setDeshabilitar(true);
        try {
            if (!file) {
                sendMessage("Selecciona el PDF del informe", "Error");
                return;
            }

            const dataForm = new FormData();
            dataForm.append("archivo", file);
            if (form.codigo) dataForm.append("codigo", form.codigo);
            dataForm.append("motivo", form.motivo || "Carga inicial");
            dataForm.append("tipoPlantilla", form.tipoPlantilla || "SIN_ACREDITACION");
            dataForm.append("reemplazar", reemplazar ? "true" : "false");

            const response = await axios.post("/operaciones/informes-ensayo/procesar", dataForm, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            resetForm();
            sendMessage(`${response.data.message}. ID: ${response.data.idAcceso}`, "Correcto");
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
                <DatosGenerales form={form} setForm={setForm} setFile={setFile} />
            </CardPlegable>
            <CardPlegable title="Configuración Documental Global" >
                <ConfiguracionDocumental />
            </CardPlegable>
            <div className="flex flex-col mx-5">
                <div className="flex justify-center m-10 ">
                    <ButtonOk type="ok" onClick={() => registrar(false)} classe="!w-80" children="Procesar Informe" />
                </div>
            </div>
        </div>
    )
};

export default RegisterInformesEnsayo;
