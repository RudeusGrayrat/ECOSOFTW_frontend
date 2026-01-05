import axios from "../../../../api/axios";
import Approve from "../../../../components/Principal/Permissions/Approve";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import { useState } from "react";

const ApproveCliente = ({ setShowApprove, selected, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const estadoSelected = selected.estado;
    const sendMessage = useSendMessage();
    const aprobar = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (estadoSelected === "ACTIVO")
                return sendMessage("El cliente ya está ACTIVO", "Error");

            const response = await axios.patch(`/comercial/patchCliente/${idSelected}`, { estado: "ACTIVO" });
            if (!response) throw new Error("Error en la activación del cliente");
            sendMessage(response.data.message, "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Approve tipo="ACTIVAR" setShowApprove={setShowApprove} onclick={aprobar} deshabilitar={deshabilitar} />
    );
}
export default ApproveCliente;