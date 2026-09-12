import { useState } from "react";
import { Button } from "primereact/button";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DeleteInformesEnsayo = ({ selected, rowData, setShowDelete, reload, permissionDelete, actionMode: initialActionMode = "toggle" }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [showInlineDelete, setShowInlineDelete] = useState(false);
    const [actionMode, setActionMode] = useState(initialActionMode);
    const sendMessage = useSendMessage();
    const selectedInforme = selected || rowData;
    const closeDelete = setShowDelete || setShowInlineDelete;

    const runAction = async () => {
        setDeshabilitar(true);
        try {
            const isPermanent = actionMode === "permanente";
            const action = selectedInforme?.papelera ? "restablecer" : "papelera";
            const response = isPermanent
                ? await axios.delete(`/calidad/informes-ensayo/${selectedInforme._id}/definitivo`)
                : await axios.post(`/calidad/informes-ensayo/${selectedInforme._id}/${action}`);
            sendMessage(response.data.message, response.data.type || "Correcto");
            closeDelete(false);
            await reload?.();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    if (rowData) {
        if (!permissionDelete) return null;
        return (
            <>
                <Button
                    icon={rowData?.papelera ? "pi pi-replay" : "pi pi-trash"}
                    data-pr-tooltip={rowData?.papelera ? "Restablecer informe" : "Enviar a papelera"}
                    data-pr-position="top"
                    rounded
                    outlined
                    disabled={deshabilitar}
                    className={`text-red-600! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl ${deshabilitar ? "cursor-not-allowed opacity-30" : ""}`}
                    onClick={() => {
                        setActionMode("toggle");
                        setShowInlineDelete(true);
                    }}
                />
                {rowData?.papelera && (
                    <Button
                        icon="pi pi-times-circle"
                        data-pr-tooltip="Eliminar definitivamente"
                        data-pr-position="top"
                        rounded
                        outlined
                        disabled={deshabilitar}
                        className={`text-red-700! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl ${deshabilitar ? "cursor-not-allowed opacity-30" : ""}`}
                        onClick={() => {
                            setActionMode("permanente");
                            setShowInlineDelete(true);
                        }}
                    />
                )}
                {showInlineDelete && (
                    <DeleteInformesEnsayo
                        selected={rowData}
                        setShowDelete={setShowInlineDelete}
                        reload={reload}
                        actionMode={actionMode}
                    />
                )}
            </>
        );
    }

    const isPermanent = actionMode === "permanente";
    const title = isPermanent
        ? "Eliminar Definitivamente"
        : selectedInforme?.papelera ? "Restablecer" : "Papelera";
    const message = isPermanent
        ? `¿Deseas eliminar definitivamente el informe ${selectedInforme?.codigo || ""}? Se borrará de Mongo y se eliminarán sus PDFs del servidor.`
        : selectedInforme?.papelera ? "¿Deseas regresar este informe a la lista de activos?" : "¿Deseas enviar este informe a la papelera?";
    const confirmText = isPermanent
        ? "ELIMINAR"
        : selectedInforme?.papelera ? "RESTABLECER" : "SI";

    return (
        <Delete
            setShowDelete={closeDelete}
            onclick={runAction}
            deshabilitar={deshabilitar}
            title={title}
            message={message}
            confirmText={confirmText}
        />
    );
}

export default DeleteInformesEnsayo;
