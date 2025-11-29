import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import useValidation from "../validateModulo";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";
import ButtonOk from "../../../../components/Ui/Button/Buttons";

const Register = () => {
  const { postModule, postSubModule } = useAuth;
  const [form, setForm] = useState({
    module: "",
    name: "",
  });
  const [deshabilitar, setDeshabilitar] = useState(false);
  const { error, validateForm } = useValidation(form);
  const sendMessage = useSendMessage();
  const enviar = async () => {
    try {
      if (!validateForm(form)) {
        sendMessage("Por favor completa todos los campos", "Error");
        return;
      }
      if (form.module && !form.name) {
        await postModule({ name: form.module });
        return;
      }

      if (form.module && form.name) {
        await postSubModule(form);
        return;
      }
    } catch (error) {
      sendMessage(error.message, "Error");
    }
  };
  return (
    <div className="flex flex-col w-full p-6">
      <PopUp deshabilitar={deshabilitar} />
      <CardPlegable title="Datos Generales">
        <div className="flex">
          <InputP
            label="Modulo"
            value={form.module}
            setForm={setForm}
            name="module"
            ancho="w-80"
            errorOnclick={error.module}
          />
          <InputNormal
            label="SubModulo"
            value={form.name}
            setForm={setForm}
            name="name"
            ancho="w-80"
          />
        </div>
      </CardPlegable>
      <div className="flex justify-center">
        <ButtonOk
          children="Registrar"
          onClick={enviar}
          classe="w-40 m-8"
          type="ok"
        />
      </div>
    </div>
  );
};

export default Register;
