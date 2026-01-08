import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import DatosGenerales from "../Register/DatosGenerales";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import { deepDiff } from "../../../../components/Otros/validateEdit";

const EditTiposDeGastos = ({ selected, setShowEdit, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [form, setForm] = useState({ ...selected })
    const sendMessage = useSendMessage();
    const diferencias = deepDiff(selected, form);
    const actualizar = async () => {
        setDeshabilitar(true);
        try {
            if (Object.keys(diferencias).length === 0) {
                sendMessage("No se realizaron cambios.", "Error");
                return;
            }
            if (!idSelected) {
                sendMessage("ID del tipo de gasto no encontrado.", "Error");
                return;
            }
            const response = await axios.patch(`/comercial/patchTipoDeGasto/${idSelected}`, form);
            const data = response.data;
            sendMessage(data.message, data.type);
            await reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Edit setShowEdit={setShowEdit} upDate={actualizar} deshabilitar={deshabilitar}  >
            <div className="p-4 ">
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Tipo de Gasto</span>
                <CardPlegable title="Datos Generales">
                    <DatosGenerales form={form} setForm={setForm} />
                </CardPlegable>
            </div>
        </Edit>
    );
}

export default EditTiposDeGastos;