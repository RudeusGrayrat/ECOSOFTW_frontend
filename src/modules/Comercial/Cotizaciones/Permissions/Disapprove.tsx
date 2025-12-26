import { useState } from "react";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DisapproveCotizacion = ({ selected, setShowDisapprove, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const estadoSelected = selected.estado;
    const sendMessage = useSendMessage();
    const desaprobar = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (estadoSelected === "ANULADO")
                return sendMessage("La cotización ya está anulada", "Error");
            const reponse = await axios.patch(`/comercial/patchCotizacion/${idSelected}`, { estado: "ANULADO" });
            sendMessage(reponse.data.message, "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Disapprove setShowDisapprove={setShowDisapprove} onclick={desaprobar} deshabilitar={deshabilitar} />
    )
}
export default DisapproveCotizacion;