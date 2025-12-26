import { useState } from "react";
import ClientesRegister from "./Clientes";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import axios from "../../../../api/axios";

const RegisterClientesComercial = ({ }) => {
    const [form, setForm] = useState({
        tipoCliente: "EMPRESA",
        cliente: "",
        numeroDocumento: "",
        telefono: "",
        correoElectronico: "",
        direccionLegal: "",
    });
    const [deshabilitar, setDeshabilitar] = useState(false);

    const sendMessage = useSendMessage();
    const resetForm = () => {
        setForm({
            tipoCliente: "EMPRESA",
            cliente: "",
            numeroDocumento: "",
            telefono: "",
            correoElectronico: "",
            direccionLegal: "",
        });
    }
    const register = async () => {
        setDeshabilitar(true);
        try {
            console.log("Register form data:", form);
            const response = await axios.post("/comercial/postCliente", form);
            if (response.data) {
                sendMessage(response.data.message, "Correcto")
                resetForm();
            }

        } catch (error) {
            sendMessage(error, "Error")
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <div className="px-5 ">
            <PopUp deshabilitar={deshabilitar} />
            <CardPlegable title="Registro de Clientes" >
                <ClientesRegister
                    form={form}
                    setForm={setForm}
                />
            </CardPlegable>
            <div className="flex flex-col mx-5">
                <div className="flex justify-center m-10 ">
                    <ButtonOk
                        type="ok"
                        onClick={register}
                        classe="!w-80"
                        children="Registrar"
                    />
                </div>
            </div>
        </div>
    );
}
export default RegisterClientesComercial;