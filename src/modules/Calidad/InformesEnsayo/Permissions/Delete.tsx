import { useState } from "react";
import { Button } from "primereact/button";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DeleteInformesEnsayo = ({ selected, rowData, setShowDelete, reload, permissionDelete }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [showInlineDelete, setShowInlineDelete] = useState(false);
    const sendMessage = useSendMessage();
    const selectedInforme = selected || rowData;
    const closeDelete = setShowDelete || setShowInlineDelete;

    const togglePapelera = async () => {
        setDeshabilitar(true);
        try {
            const action = selectedInforme?.papelera ? "restablecer" : "papelera";
            const response = await axios.post(`/calidad/informes-ensayo/${selectedInforme._id}/${action}`);
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
                    onClick={() => setShowInlineDelete(true)}
                />
                {showInlineDelete && (
                    <DeleteInformesEnsayo
                        selected={rowData}
                        setShowDelete={setShowInlineDelete}
                        reload={reload}
                    />
                )}
            </>
        );
    }

    return (
        <Delete
            setShowDelete={closeDelete}
            onclick={togglePapelera}
            deshabilitar={deshabilitar}
            title={selectedInforme?.papelera ? "Restablecer" : "Papelera"}
            message={selectedInforme?.papelera ? "¿Deseas regresar este informe a la lista de activos?" : "¿Deseas enviar este informe a la papelera?"}
            confirmText={selectedInforme?.papelera ? "RESTABLECER" : "SI"}
        />
    );
}

export default DeleteInformesEnsayo;
