import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import PopUp from "../../../../components/Ui/Messages/PopUp";

const EditParametros = ({ selected, setShowEdit }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const actualizar = async () => {
        // lógica para actualizar el parámetro seleccionado
    }
    return (
        <Edit setShowEdit={setShowEdit} upDate={actualizar} >
            <PopUp deshabilitar={deshabilitar} />
        </Edit>
    )
}

export default EditParametros;