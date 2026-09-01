import { useEffect, useState } from "react";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import InputP from "../../../../components/Ui/Input/InputP";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import axios from "../../../../api/axios";

const Register = () => {
  const [form, setForm] = useState({
    module: "",
    name: "",
  });
  const [modules, setModules] = useState([]);
  const [deshabilitar, setDeshabilitar] = useState(false);
  const sendMessage = useSendMessage();

  const loadModules = async () => {
    const response = await axios.get("/herramientas/getModules");
    setModules(response.data.map((module) => module.name));
  }

  useEffect(() => {
    loadModules();
  }, []);

  const resetForm = () => {
    setForm({ module: "", name: "" });
  }

  const enviar = async () => {
    setDeshabilitar(true);
    try {
      if (!form.module) {
        sendMessage("Por favor ingresa el módulo", "Error");
        return;
      }
      if (form.module && !form.name) {
        const response = await axios.post("/herramientas/postModule", { name: form.module });
        sendMessage(response.data.message, "Correcto");
        resetForm();
        await loadModules();
        return;
      }

      if (form.module && form.name) {
        const response = await axios.post("/herramientas/postSubModule", form);
        sendMessage(response.data.message, "Correcto");
        resetForm();
        await loadModules();
        return;
      }
    } catch (error) {
      sendMessage(error, "Error");
    } finally {
      setDeshabilitar(false);
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
            type="select"
            options={modules}
            ancho="w-80"
          />
          <InputP
            label="SubModulo"
            value={form.name}
            setForm={setForm}
            name="name"
            type="text"
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
