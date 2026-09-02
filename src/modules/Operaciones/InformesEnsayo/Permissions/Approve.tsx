import { useState } from "react";
import Approve from "../../../../components/Principal/Permissions/Approve";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const ApproveInformesEnsayo = ({ selected, setShowApprove, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const aprobar = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (selected.estado === "PRELIMINAR" || selected.estado === "LIBERADO")
                return sendMessage("El informe ya tiene visto bueno de jefatura", "Error");
            const response = await axios.post(`/operaciones/informes-ensayo/${idSelected}/aprobar`);
            sendMessage(response.data.message, response.data.type || "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return <Approve setShowApprove={setShowApprove} onclick={aprobar} deshabilitar={deshabilitar} tipo="APROBAR BORRADOR" />;
}

export default ApproveInformesEnsayo;
