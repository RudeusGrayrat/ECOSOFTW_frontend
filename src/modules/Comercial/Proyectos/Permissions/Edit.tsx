import { useState } from "react";
import axios from "../../../../api/axios";
import Edit from "../../../../components/Principal/Permissions/Edit";
import ProyectosRegister from "../Register/Proyectos";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";

const EditProyectos = ({ selected, setShowEdit, reload }) => {
    const [form, setForm] = useState({
        ...selected,
        // El formulario reutilizable usa estos nombres para edición y creación.
        proyecto: selected?.nombre || "",
        cliente: selected?.cliente_id || "",
    })
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const actualizar = async () => {
        setDeshabilitar(true);
        try {
            const { _id, cliente_id, cliente, proyecto, createdAt, updatedAt, __v, ...changes } = form;
            const response = await axios.patch(`/comercial/patchProyecto/${selected._id}`, {
                ...changes,
                nombre: proyecto || selected?.nombre,
                cliente_id: typeof cliente === "object" ? cliente?._id : cliente_id,
            });
            sendMessage(response.data.message, response.data.type || "Correcto");
            await reload();
            setShowEdit(false);
        } catch (error: any) {
            sendMessage(error?.response?.data?.message || "No se pudo actualizar el proyecto", "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <Edit setShowEdit={setShowEdit} upDate={actualizar} deshabilitar={deshabilitar} >
            <div className="p-4 ">
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Proyecto</span>
                < CardPlegable title="Editar Proyecto">
                    <ProyectosRegister form={form} setForm={setForm} />
                </CardPlegable>
            </div>
        </Edit>
    )
}

export default EditProyectos;
