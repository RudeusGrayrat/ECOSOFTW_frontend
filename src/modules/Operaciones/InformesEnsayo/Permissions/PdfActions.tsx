import { Button } from "primereact/button";
import axios from "../../../../api/axios";

const PdfActionsInformesEnsayo = ({ rowData, permissionRead, permissionReport }) => {
    const openPdf = async (download = false) => {
        const response = await axios.get(`/operaciones/informes-ensayo/${rowData._id}/archivo`, {
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
                    title="Ver PDF"
                    rounded
                    outlined
                    className="text-red-500! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl"
                    onClick={() => openPdf(false)}
                />
            )}
            {permissionReport && (
                <Button
                    icon="pi pi-download"
                    title="Descargar PDF"
                    rounded
                    outlined
                    className="text-emerald-600! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl"
                    onClick={() => openPdf(true)}
                />
            )}
        </>
    );
};

export default PdfActionsInformesEnsayo;
