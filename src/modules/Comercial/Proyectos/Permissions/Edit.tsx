import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import ProyectosRegister from "../Register/Proyectos";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";

const EditProyectos = ({ selected, setShowEdit, reload }) => {
    const [form, setForm] = useState({ ...selected })
    const [deshabilitar, setDeshabilitar] = useState(false);
    const actualizar = async () => {
        // lógica para actualizar el proyecto seleccionado
    }
    return (
        <Edit setShowEdit={setShowEdit} upDate={reload} deshabilitar={deshabilitar} >
            <div className="p-4 ">
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Parametros</span>
                < CardPlegable title="Editar Proyecto">
                    <ProyectosRegister form={form} setForm={setForm} />
                </CardPlegable>
            </div>
        </Edit>
    )
}

export default EditProyectos;