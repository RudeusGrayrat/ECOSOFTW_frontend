import { useState } from "react";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import ProyectosRegister from "./Proyectos";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const RegisterProyectos = () => {
    const [form, setForm] = useState({});
    const sendMessage = useSendMessage();
    const register = async () => {
        try {
            console.log("FORMULARIO A ENVIAR:", form);
            const reponse = await axios.post("/comercial/postProyecto", form);
            console.log("Respuesta del servidor:", reponse);
        } catch (error) {
            sendMessage(error, "Error");
        }
    }
    return (
        <div className="flex flex-col items-center justify-center">
            <CardPlegable title="Registro de Proyectos">
                <ProyectosRegister form={form} setForm={setForm} />
            </CardPlegable>
            <ButtonOk classe="w-90 max-sm:w-64 !p-3 !rounded-2xl font-medium text-lg" type="ok" onClick={register}>
                Confirmar
            </ButtonOk>
        </div>

    )
}

export default RegisterProyectos;