import { useState } from "react";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import DatosDelParametro from "./DatosDelParametro";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";

const RegisterParametrosComercial = () => {
    const [habilitar, setHabilitar] = useState(false);
    const [form, setForm] = useState({
        tipoDeAnalisis: "",
        parametro: "",
        metodo: "",
        acreditadoPor: "",
        limiteDeCuantificacionDelMetodo: "",
        limiteDeDeteccionDelMetodo: "",
        unidadDeMedida: "",
        precio: 0,
    });
    const sendMessage = useSendMessage();
    const resetForm = () => {
        setForm({
            tipoDeAnalisis: "",
            parametro: "",
            metodo: "",
            acreditadoPor: "-",
            limiteDeCuantificacionDelMetodo: "",
            limiteDeDeteccionDelMetodo: "",
            unidadDeMedida: "",
            precio: 0,
        });
        setHabilitar(false);
    }
    const register = async () => {
        setHabilitar(true);
        try {
            const response = await axios.post("/comercial/postParametro", form);
            console.log("Formulario de registro de parametro ", response);
            const dataStatus = response.status;
            if (dataStatus > 200) {
                sendMessage(response.data.message, "Correcto");
            }
            resetForm();
        } catch (error) {
            console.error("Error post Parametro ", error);
            sendMessage(error || error?.message, "Error");
        } finally {
            setHabilitar(false);
        }
    }
    return (
        <div className="px-5 ">
            <PopUp deshabilitar={habilitar} />
            <CardPlegable title="Datos del Parametro">
                <DatosDelParametro form={form} setForm={setForm} />
            </CardPlegable>

            <div className="flex flex-col mx-5">
                <div className="flex justify-center m-10 ">
                    <ButtonOk
                        type="ok"
                        onClick={register}
                        classe="!w-60"
                        children="Registrar"
                    />
                </div>
            </div>
        </div>
    )
}

export default RegisterParametrosComercial;