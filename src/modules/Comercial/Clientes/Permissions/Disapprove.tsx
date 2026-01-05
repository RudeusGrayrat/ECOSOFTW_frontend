import { useState } from "react";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DisapproveCliente = ({ setShowDisapprove, selected, reload }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const idSelected = selected._id;
    const sendMessage = useSendMessage();
    const desactivar = async () => {
        setDeshabilitar(true);
        try {
            if (!idSelected) return;
            if (selected.estado === "INACTIVO")
                return sendMessage("El cliente ya está INACTIVO", "Error");
            const response = await axios.patch(`/comercial/patchCliente/${idSelected}`, { estado: "INACTIVO" });
            if (!response) throw new Error("Error en la desactivación del cliente");
            sendMessage(response.data.message, "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    };
    return (
        <Disapprove tipo="DESACTIVAR" setShowDisapprove={setShowDisapprove} deshabilitar={deshabilitar} onclick={desactivar} />
    );
}

export default DisapproveCliente;