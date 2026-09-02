import { useState } from "react";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const DeleteInformesEnsayo = ({ selected, setShowDelete, reload }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const togglePapelera = async () => {
        setDeshabilitar(true);
        try {
            const action = selected?.papelera ? "restablecer" : "papelera";
            const response = await axios.post(`/operaciones/informes-ensayo/${selected._id}/${action}`);
            sendMessage(response.data.message, response.data.type || "Correcto");
            setShowDelete(false);
            await reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return (
        <Delete
            setShowDelete={setShowDelete}
            onclick={togglePapelera}
            deshabilitar={deshabilitar}
            title={selected?.papelera ? "Restablecer" : "Papelera"}
            message={selected?.papelera ? "¿Deseas regresar este informe a la lista de activos?" : "¿Deseas enviar este informe a la papelera?"}
            confirmText={selected?.papelera ? "RESTABLECER" : "SI"}
        />
    );
}

export default DeleteInformesEnsayo;
