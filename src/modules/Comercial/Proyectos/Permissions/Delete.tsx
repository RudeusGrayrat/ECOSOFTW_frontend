import { useState } from "react";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";

const DeleteProyecto = ({ setShowDelete, selected, reload }) => {
    const idSelected = selected?._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const eliminar = async () => {
        setDeshabilitar(true);
        sendMessage("Eliminando proyecto...", "Info");
        try {
            if (!idSelected) return sendMessage("No se encontró el proyecto seleccionado", "Error");
            reload();
        } catch (error) {
            sendMessage(error || "Error al eliminar el proyecto", "error");
        } finally {
            setDeshabilitar(false);
        }
    };

    return <Delete setShowDelete={setShowDelete} onclick={eliminar} deshabilitar={deshabilitar} />;
}

export default DeleteProyecto;