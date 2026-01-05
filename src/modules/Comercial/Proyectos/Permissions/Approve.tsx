import axios from "../../../..//api/axios";
import Approve from "../../../../components/Principal/Permissions/Approve";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import { useState } from "react";

const ApproveProyectos = ({ selected, setShowApprove, reload }) => {
    const idSelected = selected?._id
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage()
    const aprobar = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.patch(`comercial/patchProyecto/${idSelected}`, {
                estado: 'ACTIVO'
            });
            sendMessage(response.data.message, response.data.type);
            await reload()
        } catch (error) {
            sendMessage(error || error.message, 'Error');
        } finally {
            setDeshabilitar(false);
        }
    }
    return <Approve setShowApprove={setShowApprove} onclick={aprobar} deshabilitar={deshabilitar} tipo="cambiar a ACTIVO" />;
}

export default ApproveProyectos;