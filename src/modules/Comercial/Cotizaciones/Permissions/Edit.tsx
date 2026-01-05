import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import { deepDiff } from "../../../../components/Otros/validateEdit";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../././../../api/axios";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import Proyecto from "../Register/Proyecto";
import Directorio from "../../../../components/Principal/AddRemove/AddRemove";
import GastosOperativos from "../Register/GastosOperativos";
import GastosAdministrativos from "../Register/GastosAdministrativos";
import Analisis from "../Register/Analisis";
import GastosGenerales from "../Register/GastosGenerales";
import Totales from "../Register/totales";

const EditCotizacion = ({ selected, setShowEdit, reload }) => {
  const idSelected = selected._id;
  const [form, setForm] = useState({ ...selected });
  console.log("selected en EditCotizacion:", selected);
  const changes = deepDiff(form, selected);
  const [deshabilitar, setDeshabilitar] = useState(false);
  const sendMessage = useSendMessage();
  const editar = async () => {
    setDeshabilitar(true);
    try {
      if (!idSelected) return;
      if (Object.keys(changes).length === 0) {
        sendMessage("No hay cambios para guardar", "Error");
        return;
      }
      const response = await axios.patch(`/comercial/patchCotizacion/${idSelected}`, changes);
      sendMessage(response.data.message, "Correcto");
      await reload();
    } catch (error) {
      sendMessage(error, "Error");
    }
    finally {
      setDeshabilitar(false);
      setShowEdit(false);
    }
  }
  return (
    <Edit setShowEdit={setShowEdit} upDate={editar} deshabilitar={deshabilitar} >
      <div className="p-4">
        <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Cotización</span>
        <CardPlegable title="Proyecto">
          <Proyecto form={form} setForm={setForm} />
        </CardPlegable>
        <CardPlegable title="Gastos Operativos">
          <Directorio
            estilos="flex justify-center items-center"
            ItemComponent={GastosOperativos}
            directory={form?.gastosOperativos}
            data="gastosOperativos"
            setForm={setForm}
          />
        </CardPlegable>
        <CardPlegable title="Gastos Administrativos">
          <Directorio
            estilos="flex justify-center items-center"
            ItemComponent={GastosAdministrativos}
            directory={form?.gastosAdministrativos}
            data="gastosAdministrativos"
            setForm={setForm}
          />
        </CardPlegable>
        <CardPlegable title="Análisis de Cotización">
          <Directorio
            estilos="flex justify-center items-center"
            ItemComponent={Analisis}
            directory={form.analisis}
            data="analisis"
            setForm={setForm}
          />
        </CardPlegable>
        <CardPlegable title="Gastos Generales">
          {form.gastosGenerales.length > 0 && (
            form.gastosGenerales.map((item, index) => (
              <GastosGenerales
                form={item}
              />
            ))
          )}
        </CardPlegable>
        <CardPlegable title="Totales">
          <Totales form={form} setForm={setForm} />
        </CardPlegable>
      </div>
    </Edit>
  )
}
export default EditCotizacion;