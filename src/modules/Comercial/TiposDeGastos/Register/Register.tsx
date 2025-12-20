import { useState } from "react";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosGenerales from "./DatosGenerales";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import PopUp from "../../../../components/Ui/Messages/PopUp";

const RegisterTiposDeGastos = () => {
    const [form, setForm] = useState({});
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const resetForm = () => {
        setForm({});
    }
    const registrar = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.post("/comercial/postTiposDeGastos", form)
            if (response.status > 200 && response.status < 300) {
                resetForm();
                return sendMessage("Tipo de Gasto registrado con éxito", "Correcto");
            } else {
                sendMessage("Error al registrar el Tipo de Gasto", "Error");
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
            <div className="flex flex-col mx-5">
                <div className="flex justify-center m-10 ">
                    <ButtonOk
                        type="ok"
                        onClick={registrar}
                        classe="!w-80"
                        children="Registrar"
                    />
                </div>
            </div>
        </div>
    )
};

export default RegisterTiposDeGastos;