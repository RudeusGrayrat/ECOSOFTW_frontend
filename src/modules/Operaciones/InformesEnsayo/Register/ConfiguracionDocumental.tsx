import { useEffect, useState } from "react";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import InputArchivoConfig from "./InputArchivoConfig";

const tiposMarca = [
    { label: "INACAL", value: "INACAL" },
    { label: "NAC", value: "NAC" },
    { label: "Sin Acreditación", value: "SIN_ACREDITACION" },
];

const ConfiguracionDocumental = () => {
    const [config, setConfig] = useState(null);
    const [firma, setFirma] = useState(null);
    const [marcas, setMarcas] = useState({});
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const load = async () => {
        const response = await axios.get("/operaciones/informes-ensayo/configuracion");
        setConfig(response.data);
    }

    useEffect(() => {
        load().catch(() => sendMessage("No se pudo cargar la configuración documental", "Error"));
    }, []);

    const uploadFile = async (url, file, successMessage, onSuccess = () => { }) => {
        if (!file) return sendMessage("Selecciona un archivo", "Error");
        setDeshabilitar(true);
        try {
            const form = new FormData();
            form.append("archivo", file);
            const response = await axios.post(url, form, { headers: { "Content-Type": "multipart/form-data" } });
            sendMessage(response.data.message || successMessage, response.data.type || "Correcto");
            onSuccess();
            await load();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    const deleteFile = async (url, successMessage, onSuccess = () => { }) => {
        setDeshabilitar(true);
        try {
            const response = await axios.delete(url);
            sendMessage(response.data.message || successMessage, response.data.type || "Correcto");
            onSuccess();
            await load();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="mx-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
                Esta configuración es global. Solo actualízala cuando cambie la firma autorizada o alguna plantilla de marca de agua; los nuevos informes usarán estos archivos.
            </div>

            <InputArchivoConfig
                label="Firma Autorizada"
                accept="image/png,image/jpeg"
                currentFile={config?.firma?.filename}
                selectedFile={firma}
                disabled={deshabilitar}
                onSelect={setFirma}
                onUpload={() => uploadFile("/operaciones/informes-ensayo/configuracion/firma", firma, "Firma actualizada", () => setFirma(null))}
                onDelete={() => deleteFile("/operaciones/informes-ensayo/configuracion/firma", "Firma eliminada", () => setFirma(null))}
            />

            <div className="flex flex-wrap gap-4">
                {tiposMarca.map((tipo) => (
                    <div key={tipo.value} className="flex flex-wrap items-end gap-3 border-t border-gray-100 pt-4">
                        <InputArchivoConfig
                            label={`Marca de Agua ${tipo.label}`}
                            accept="application/pdf"
                            currentFile={config?.marcasAgua?.[tipo.value]?.filename}
                            selectedFile={marcas[tipo.value]}
                            disabled={deshabilitar}
                            onSelect={(file) => setMarcas((prev) => ({ ...prev, [tipo.value]: file }))}
                            onUpload={() => uploadFile(
                                `/operaciones/informes-ensayo/configuracion/marca-agua/${tipo.value}`,
                                marcas[tipo.value],
                                "Marca de agua actualizada",
                                () => setMarcas((prev) => ({ ...prev, [tipo.value]: null }))
                            )}
                            onDelete={() => deleteFile(
                                `/operaciones/informes-ensayo/configuracion/marca-agua/${tipo.value}`,
                                "Marca de agua eliminada",
                                () => setMarcas((prev) => ({ ...prev, [tipo.value]: null }))
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ConfiguracionDocumental;
