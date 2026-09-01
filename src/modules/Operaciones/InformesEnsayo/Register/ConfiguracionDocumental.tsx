import { useEffect, useState } from "react";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

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

    const uploadFile = async (url, file, successMessage) => {
        if (!file) return sendMessage("Selecciona un archivo", "Error");
        setDeshabilitar(true);
        try {
            const form = new FormData();
            form.append("archivo", file);
            const response = await axios.post(url, form, { headers: { "Content-Type": "multipart/form-data" } });
            sendMessage(response.data.message || successMessage, response.data.type || "Correcto");
            await load();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col mx-3 F h-20">
                    <label className="text-base font-medium text-gray-700">Firma Autorizada</label>
                    <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(event) => setFirma(event.target.files?.[0] || null)}
                        className="mt-1 px-3 py-2 border min-w-56 text-base! rounded-md! shadow-sm sm:text-sm bg-white border-gray-300!"
                    />
                </div>
                <ButtonOk
                    type="ok"
                    onClick={() => uploadFile("/operaciones/informes-ensayo/configuracion/firma", firma, "Firma actualizada")}
                    classe="!w-44"
                    children="Actualizar Firma"
                    disabled={deshabilitar}
                />
                {config?.firma?.filename && <span className="mb-6 text-sm font-semibold text-sky-700">{config.firma.filename}</span>}
            </div>

            <div className="flex flex-col gap-4">
                {tiposMarca.map((tipo) => (
                    <div key={tipo.value} className="flex flex-wrap items-end gap-3 border-t border-gray-100 pt-4">
                        <div className="flex flex-col mx-3 F h-20">
                            <label className="text-base font-medium text-gray-700">Marca de Agua {tipo.label}</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(event) => setMarcas((prev) => ({ ...prev, [tipo.value]: event.target.files?.[0] || null }))}
                                className="mt-1 px-3 py-2 border min-w-56 text-base! rounded-md! shadow-sm sm:text-sm bg-white border-gray-300!"
                            />
                        </div>
                        <ButtonOk
                            type="ok"
                            onClick={() => uploadFile(`/operaciones/informes-ensayo/configuracion/marca-agua/${tipo.value}`, marcas[tipo.value], "Marca de agua actualizada")}
                            classe="!w-52"
                            children="Actualizar Marca"
                            disabled={deshabilitar}
                        />
                        {config?.marcasAgua?.[tipo.value]?.filename && (
                            <span className="mb-6 text-sm font-semibold text-sky-700">{config.marcasAgua[tipo.value].filename}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ConfiguracionDocumental;
