import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosDelParametro from "../Register/DatosDelParametro";
import { deepDiff } from "../../../../components/Otros/validateEdit";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const EditParametros = ({ selected, setShowEdit, reload }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const idSelected = selected._id;
    const [form, setForm] = useState({ ...selected })
    const diferencias = deepDiff(selected, form);
    const sendMessage = useSendMessage();
    const actualizar = async () => {
        sendMessage("Cargando...", "Espera");
        setDeshabilitar(true);
        try {
            if (Object.keys(diferencias).length === 0) {
                sendMessage("No se realizaron cambios.", "Error");
                return;
            }
            if (!idSelected) {
                sendMessage("ID del parámetro no encontrado.", "Error");
                return;
            }
            const response = await axios.patch(`/comercial/patchParametro/${idSelected}`, form);
            sendMessage(response.data.message, response.data.type);
            await reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Edit setShowEdit={setShowEdit} upDate={actualizar} deshabilitar={deshabilitar} >
            <div className="p-4 ">
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Parametros</span>
                <CardPlegable title="Editar Parámetro">
                    <DatosDelParametro form={form} setForm={setForm} />
                </CardPlegable>
            </div>
        </Edit>
    )
}

export default EditParametros;