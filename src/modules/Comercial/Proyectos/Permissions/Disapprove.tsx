import { useState } from "react";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DisapproveProyecto = ({ selected, setShowDisapprove, reload }) => {
    const idSelected = selected?._id
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage()
    const desaprobar = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.patch(`comercial/patchProyecto/${idSelected}`, {
                estado: 'INACTIVO'
            });
            sendMessage(response.data.message, response.data.type);
            await reload()
        } catch (error) {
            sendMessage(error || error.message, 'Error');
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Disapprove setShowDisapprove={setShowDisapprove} onclick={desaprobar} deshabilitar={deshabilitar} tipo="cambiar a INACTIVO" />
    )
}

export default DisapproveProyecto;