import { useState } from "react";
import Approve from "../../../../components/Principal/Permissions/Approve";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";

const ApproveCotizacion = ({ selected, setShowApprove, reload }) => {
    const idSelected = selected._id;
    const estadoSelected = selected.estado;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const aprobar = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (estadoSelected === "APROBADO")
                return sendMessage("La cotización ya está aprobada", "Error");
            const response = await axios.patch(`/comercial/patchCotizacion/${idSelected}`, { estado: "APROBADO", aprobadoPor: user?._id });
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
    )
}

export default ApproveCotizacion;
