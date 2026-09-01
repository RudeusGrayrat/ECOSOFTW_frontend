import { useState } from "react";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DisapprovePermisos = ({ setShowDisapprove, selected, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const onclick = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (selected.estado === "INACTIVO")
                return sendMessage("El permiso ya está INACTIVO", "Error");
            const response = await axios.patch(`/herramientas/patchPermission/${idSelected}`, { estado: "INACTIVO" });
            if (!response) throw new Error("Error en la desactivación del permiso");
            sendMessage(response.data.message, response.data.type || "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Disapprove onclick={onclick} setShowDisapprove={setShowDisapprove} deshabilitar={deshabilitar} tipo="DESACTIVAR" />
    )
}

export default DisapprovePermisos;
