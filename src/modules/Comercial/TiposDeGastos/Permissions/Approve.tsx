import { useState } from "react";
import Approve from "../../../../components/Principal/Permissions/Approve";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const ApproveTiposDeGastos = ({ selected, setShowApprove, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const aprobar = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (selected.estado === "ACTIVO")
                return sendMessage("El tipo de gasto ya está ACTIVO", "Error");
            const response = await axios.patch(`/comercial/patchTipoDeGasto/${idSelected}`, { estado: "ACTIVO" });
            if (!response) throw new Error("Error en la activación del tipo de gasto");
            sendMessage(response.data.message, response.data.type || "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return <Approve setShowApprove={setShowApprove} onclick={aprobar} deshabilitar={deshabilitar} tipo="ACTIVAR" />;
}

export default ApproveTiposDeGastos;