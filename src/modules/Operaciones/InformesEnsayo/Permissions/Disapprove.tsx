import { useState } from "react";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DisapproveInformesEnsayo = ({ selected, setShowDisapprove, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const anular = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (selected.estado === "NO DISPONIBLE")
                return sendMessage("El informe ya está NO DISPONIBLE", "Error");
            const response = await axios.post(`/operaciones/informes-ensayo/${idSelected}/anular`);
            sendMessage(response.data.message, response.data.type || "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return <Disapprove setShowDisapprove={setShowDisapprove} onclick={anular} deshabilitar={deshabilitar} tipo="MARCAR NO DISPONIBLE" />;
}

export default DisapproveInformesEnsayo;
