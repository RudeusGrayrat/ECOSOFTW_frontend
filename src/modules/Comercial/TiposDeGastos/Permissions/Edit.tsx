import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import DatosGenerales from "../Register/DatosGenerales";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";

const EditTiposDeGastos = ({ selected, setShowEdit, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [form, setForm] = useState({ ...selected })
    const actualizar = async () => {
        await reload();
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