import { useState } from "react";
import axios from "../../../../api/axios";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";

const DeleteParametros = ({ selected, setShowDelete, reload }) => {
  const [deshabilitar, setDeshabilitar] = useState(false);
  const sendMessage = useSendMessage();
  const eliminar = async () => {
    if (!selected?._id) return sendMessage("No se encontró el parámetro seleccionado", "Error");
    setDeshabilitar(true);
    try {
      const response = await axios.delete(`/comercial/parametros/${selected._id}`);
      sendMessage(response.data.message, response.data.type);
      await reload();
      setShowDelete(false);
    } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo eliminar el parámetro", "Error"); }
    finally { setDeshabilitar(false); }
  };
  return <Delete setShowDelete={setShowDelete} onclick={eliminar} deshabilitar={deshabilitar} title="Eliminar parámetro" message={`¿Eliminar ${selected?.parametro || "este parámetro"}? Si ya fue cotizado, se desactivará para proteger el historial.`} confirmText="Eliminar" />;
};

export default DeleteParametros;
