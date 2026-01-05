import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import ClientesRegister from "../Register/Clientes";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import { deepDiff } from "../../../../components/Otros/validateEdit";
import axios from "../../././../../api/axios";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import PopUp from "../../../../components/Ui/Messages/PopUp";

const EditCliente = ({ selected, setShowEdit, reload }) => {
    const [form, setForm] = useState({ ...selected })
    const changes = deepDiff(selected, form);
    const sendMessage = useSendMessage();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const actualizar = async () => {
        try {
            if (Object.keys(changes).length === 0) {
                sendMessage("No hay cambios para guardar", "Error");
                return;
            }
            // Aquí iría la lógica para actualizar el cliente con los cambios
            const response = await axios.patch(`/comercial/patchCliente/${selected._id}`, changes);
            sendMessage(response.data.message, "Correcto");
            await reload();
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
            setShowEdit(false);
        }
    }
    return (
        <Edit upDate={actualizar} setShowEdit={setShowEdit} deshabilitar={deshabilitar}>
            <div className="p-4 ">
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Cliente</span>
                <CardPlegable title="Cliente">
                    <ClientesRegister form={form} setForm={setForm} />
                </CardPlegable>
            </div>
        </Edit>
    );
};

export default EditCliente;