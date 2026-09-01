import { useEffect, useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import DatosGenerales from "../Register/DatosGenerales";
import Accesos from "../Register/Accesos";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import { deepDiff } from "../../../../components/Otros/validateEdit";

const EditUsuarios = ({ selected, setShowEdit, reload }) => {
    const idSelected = selected._id;
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [form, setForm] = useState({ ...selected, password: "" })
    const [catalogo, setCatalogo] = useState({ modules: [], submodules: [], permissions: [] });
    const sendMessage = useSendMessage();
    const diferencias = deepDiff(selected, form);

    const loadCatalogo = async () => {
        const response = await axios.get("/herramientas/getCatalogoAccesos");
        setCatalogo(response.data);
    }

    useEffect(() => {
        loadCatalogo();
    }, []);

    const actualizar = async () => {
        setDeshabilitar(true);
        try {
            if (Object.keys(diferencias).length === 0) {
                sendMessage("No se realizaron cambios.", "Error");
                return;
            }
            if (!idSelected) {
                sendMessage("ID del usuario no encontrado.", "Error");
                return;
            }
            const payload = { ...form };
            if (!payload.password) delete payload.password;
            const response = await axios.patch(`/herramientas/patchUser/${idSelected}`, payload);
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
                <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Usuario</span>
                <CardPlegable title="Datos Generales">
                    <DatosGenerales form={form} setForm={setForm} editing />
                </CardPlegable>
                <CardPlegable title="Accesos">
                    <Accesos form={form} setForm={setForm} catalogo={catalogo} />
                </CardPlegable>
            </div>
        </Edit>
    );
}

export default EditUsuarios;
