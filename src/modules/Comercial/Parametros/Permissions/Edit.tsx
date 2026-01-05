import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosDelParametro from "../Register/DatosDelParametro";

const EditParametros = ({ selected, setShowEdit }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [form, setForm] = useState({ ...selected })
    const actualizar = async () => {
        // lógica para actualizar el parámetro seleccionado
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