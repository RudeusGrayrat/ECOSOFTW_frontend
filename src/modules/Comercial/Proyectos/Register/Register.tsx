import { useState } from "react";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import ProyectosRegister from "./Proyectos";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import dayjs from "dayjs";

const RegisterProyectos = () => {
    const [form, setForm] = useState({
        cantidadPuntosParametros: "",
        cliente: "",
        lugarMuestreo: "",
        proyecto: "",
        servicio: "",
        fechaServicio: "",
    });
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();

    const resetForm = () => {
        setForm({
            cantidadPuntosParametros: "",
            cliente: "",
            lugarMuestreo: "",
            proyecto: "",
            servicio: "",
            fechaServicio: ""
        });
    }
    const register = async () => {
        setDeshabilitar(true);
        try {
            const { cliente, ...formWithoutCliente } = form;
            const newForm = {
                ...formWithoutCliente,
                cliente_id: form?.cliente?._id,
                fechaServicio: dayjs(form.fechaServicio).format('DD/MM/YYYY'),
                nombre: form.proyecto
            }
            console.log("newForm", newForm);
            const reponse = await axios.post("/comercial/postProyecto", newForm);
            if (!reponse.data)
                sendMessage("Error al registrar el proyecto", "Error");
            sendMessage(reponse.data.message, "Correcto");
            resetForm();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center">
            <PopUp deshabilitar={deshabilitar} />
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