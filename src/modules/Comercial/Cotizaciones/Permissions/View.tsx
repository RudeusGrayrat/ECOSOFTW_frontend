import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import { useAuth } from "../../../../context/AuthContext";

const ViewCotizacion = ({ selected, setShowDetail }) => {
    const [pdfUrl, setPdfUrl] = useState("");
    const [loadingPdf, setLoadingPdf] = useState(true);
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const [planId, setPlanId] = useState("");
    const tieneTercerizados = selected?.analisis?.some((item) => item.modalidad === "TERCERIZADO");
    useEffect(() => {
        let url = "";
        const generarPdf = async () => {
            setLoadingPdf(true);
            try {
                const response = await axios.post(`/comercial/cotizaciones/${selected._id}/pdf`, {}, { responseType: "blob" });
                url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                setPdfUrl(url);
            } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo generar el PDF. Verifica que exista una plantilla activa.", "Error"); }
            finally { setLoadingPdf(false); }
        };
        if (selected?._id) generarPdf();
        return () => { if (url) URL.revokeObjectURL(url); };
    }, [selected?._id]);
    const crearPlan = async () => {
        try {
            const response = await axios.post(`/operaciones/planes-trabajo/desde-cotizacion/${selected._id}`, { creadoPor: user?._id });
            setPlanId(response.data.data?._id || "");
            sendMessage(response.data.message, response.data.type || "Correcto");
        } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo crear el Plan de Trabajo", "Error"); }
    };
    const crearOrden = async () => {
        try {
            const response = await axios.post(`/operaciones/ordenes-internas/desde-plan/${planId}`, { creadoPor: user?._id });
            sendMessage(response.data.message, response.data.type || "Correcto");
        } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo crear la Orden Interna", "Error"); }
    };
    return (
        <Details setShowDetail={setShowDetail} title="Detalle de Cotización">
                <div className="flex flex-col gap-4 p-[2%]">
                    {selected.estado === "APROBADO" && (
                        <div className="flex flex-wrap gap-3 rounded-xl bg-emerald-50 p-4">
                            <ButtonOk type="ok" onClick={crearPlan} classe="!w-56">Generar Plan de Trabajo</ButtonOk>
                            {planId && tieneTercerizados && <ButtonOk type="ok" onClick={crearOrden} classe="!w-56">Generar Orden Interna</ButtonOk>}
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-semibold mb-1">Cotización {selected.correlativaVisible || selected.correlativa}</h2>
                        <p className="text-sm text-slate-500">Generada desde la plantilla documental activa.</p>
                    </div>
                    {loadingPdf && <p className="text-slate-500">Generando PDF…</p>}
                    {!loadingPdf && pdfUrl && <><div className="flex gap-3"><ButtonOk type="ok" onClick={() => window.open(pdfUrl, "_blank")}>Ver PDF</ButtonOk><ButtonOk type="ok" onClick={() => { const link = document.createElement("a"); link.href = pdfUrl; link.download = `Cotizacion_${selected.correlativaVisible || "documento"}.pdf`; link.click(); }}>Descargar PDF</ButtonOk></div><iframe className="min-h-[520px] w-full rounded-lg border" title="Vista previa de cotización" src={pdfUrl} /></>}
                </div>

        </Details>
    )
}

export default ViewCotizacion;
