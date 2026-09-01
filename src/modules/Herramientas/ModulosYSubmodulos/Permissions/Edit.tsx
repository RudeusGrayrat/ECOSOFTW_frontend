import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import InputP from "../../../../components/Ui/Input/InputP";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import { deepDiff } from "../../../../components/Otros/validateEdit";

const EditModulosYSubmodulos = ({ selected, setShowEdit, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [form, setForm] = useState({ ...selected });
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
                sendMessage("ID del registro no encontrado.", "Error");
                return;
            }
            const response = await axios.patch(`/herramientas/patchModuloYSubmodulo/${idSelected}`, form);
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
        <Edit setShowEdit={setShowEdit} upDate={actualizar} deshabilitar={deshabilitar}>
            <div className="p-4 ">
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Estructura</span>
                <CardPlegable title="Datos Generales">
                    <div className="flex flex-wrap">
                        <InputP label="Tipo" name="tipo" type="text" ancho="w-80!" value={form.tipo} setForm={setForm} disabled />
                        <InputP label="Modulo" name="module" type="text" ancho="w-80!" value={form.module} setForm={setForm} />
                        {form.tipo === "SUBMODULO" && (
                            <InputP label="SubModulo" name="name" type="text" ancho="w-80!" value={form.name} setForm={setForm} />
                        )}
                        <InputP label="Orden" name="order" type="number" ancho="w-56!" value={form.order} setForm={setForm} />
                    </div>
                </CardPlegable>
            </div>
        </Edit>
    );
}

export default EditModulosYSubmodulos;
