import { useEffect, useState } from "react";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosGenerales from "./DatosGenerales";
import Accesos from "./Accesos";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import PopUp from "../../../../components/Ui/Messages/PopUp";

const RegisterUsuarios = () => {
    const [form, setForm] = useState({ modules: [] });
    const [catalogo, setCatalogo] = useState({ modules: [], submodules: [], permissions: [] });
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const loadCatalogo = async () => {
        const response = await axios.get("/herramientas/getCatalogoAccesos");
        setCatalogo(response.data);
    }

    useEffect(() => {
        loadCatalogo();
    }, []);

    const resetForm = () => {
        setForm({ modules: [] });
    }

    const registrar = async () => {
        setDeshabilitar(true);
        try {
            const payload = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === "modules") payload.append(key, JSON.stringify(value));
                else if (key === "photoFile" && value) payload.append("photo", value as File);
                else if (key === "firmaFile" && value) payload.append("firma", value as File);
                else if (!["photoFile", "firmaFile", "photo", "firma", "photoArchivo", "firmaArchivo"].includes(key) && value !== undefined && value !== null) payload.append(key, String(value));
            });
            const response = await axios.post("/herramientas/postUsuariosEcosoft", payload)
            if (response.status > 200 && response.status < 300) {
                resetForm();
                return sendMessage("Usuario registrado con éxito", "Correcto");
            } else {
                sendMessage("Error al registrar el usuario", "Error");
            }
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return (
        <div>
            <PopUp deshabilitar={deshabilitar} />
            <CardPlegable title="Información General" >
                <DatosGenerales form={form} setForm={setForm} />
            </CardPlegable>
            <CardPlegable title="Accesos">
                <Accesos form={form} setForm={setForm} catalogo={catalogo} />
            </CardPlegable>
            <div className="flex flex-col mx-5">
                <div className="flex justify-center m-10 ">
                    <ButtonOk type="ok" onClick={registrar} classe="!w-80" children="Registrar" />
                </div>
            </div>
        </div>
    )
};

export default RegisterUsuarios;
