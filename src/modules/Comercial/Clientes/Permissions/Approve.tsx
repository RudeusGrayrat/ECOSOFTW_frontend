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
            if (estadoSelected === "APROBADO")
                return sendMessage("El cliente ya está aprobado", "Error");

            const response = await axios.patch(`/comercial/patchCliente/${idSelected}`, { estado: "APROBADO" });
            sendMessage(response.data.message, "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Approve setShowApprove={setShowApprove} onclick={aprobar} deshabilitar={deshabilitar} />
    );
}
export default ApproveCliente;