import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import DatosGenerales from "../Register/DatosGenerales";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import { deepDiff } from "../../../../components/Otros/validateEdit";

const EditPermisos = ({ selected, setShowEdit, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [form, setForm] = useState({ ...selected, name: selected.name })
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
                sendMessage("ID del permiso no encontrado.", "Error");
                return;
            }
            const response = await axios.patch(`/herramientas/patchPermission/${idSelected}`, {
                description: form.description,
                estado: form.estado
            });
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
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Permiso</span>
                <CardPlegable title="Datos Generales">
                    <DatosGenerales form={form} setForm={setForm} disabledName />
                </CardPlegable>
            </div>
        </Edit>
    );
}

export default EditPermisos;
