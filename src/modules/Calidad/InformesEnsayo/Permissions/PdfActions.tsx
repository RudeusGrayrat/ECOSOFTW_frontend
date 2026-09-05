import { Button } from "primereact/button";
import axios from "../../../../api/axios";

const PdfActionsInformesEnsayo = ({ rowData, permissionRead, permissionReport }) => {
    const openConsulta = () => {
        if (!rowData.urlConsulta) return;
        const consultaUrl = new URL(rowData.urlConsulta, window.location.origin);
        if (rowData.codigo) consultaUrl.searchParams.set("codigo", rowData.codigo);
        window.open(consultaUrl.toString(), "_blank", "noopener,noreferrer");
    };

    const openPdf = async (download = false) => {
        const response = await axios.get(`/calidad/informes-ensayo/${rowData._id}/archivo`, {
            params: { download },
            responseType: "blob"
        });
        const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));

        if (download) {
            const link = document.createElement("a");
            link.href = url;
            link.download = rowData.archivoGenerado || `${rowData.codigo}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            return;
        }

        window.open(url, "_blank");
    };

    return (
        <>
            {permissionRead && (
                <Button
                    icon="pi pi-file-pdf"
                    data-pr-tooltip="Ver PDF"
                    data-pr-position="top"
                    rounded
                    outlined
                    className="text-red-500! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl"
                    onClick={() => openPdf(false)}
                />
            )}
            {permissionReport && (
                <Button
                    icon="pi pi-download"
                    data-pr-tooltip="Descargar PDF"
                    data-pr-position="top"
                    rounded
                    outlined
                    className="text-emerald-600! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl"
                    onClick={() => openPdf(true)}
                />
            )}
            {rowData.urlConsulta && (
                <Button
                    icon="pi pi-external-link"
                    data-pr-tooltip="Abrir consulta pública"
                    data-pr-position="top"
                    rounded
                    outlined
                    className="text-sky-500! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl"
                    onClick={openConsulta}
                />
            )}
        </>
    );
};

export default PdfActionsInformesEnsayo;
