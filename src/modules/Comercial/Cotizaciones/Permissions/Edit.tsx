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
import { useAuth } from "../../../../context/AuthContext";

const EditCotizacion = ({ selected, setShowEdit, reload }) => {
  console.log("Selected Cotización for Edit:", selected);
  const idSelected = selected._id;
  const { user } = useAuth();
  const [form, setForm] = useState({ ...selected });
  const [codigoManual, setCodigoManual] = useState("");
  const [motivoCambioCodigo, setMotivoCambioCodigo] = useState("");
  const changes = deepDiff(form, selected);
  console.log("Detected Changes in EditCotizacion:", changes);
  const [deshabilitar, setDeshabilitar] = useState(false);
  const sendMessage = useSendMessage();
  const editar = async () => {
    setDeshabilitar(true);
    try {
      if (!idSelected) return;
      if (Object.keys(changes).length === 0 && !codigoManual.trim()) {
        sendMessage("No hay cambios para guardar", "Error");
        return;
      }
      if (!user) {
        sendMessage("Usuario no autenticado", "Error");
        return;
      }
      const response = await axios.post(`/comercial/cotizaciones/${idSelected}/nueva-version`, {
        ...changes,
        actualizadoPor: user._id,
        creadoPor: user._id,
        codigoManual: codigoManual.trim(),
        motivoCambioCodigo: motivoCambioCodigo.trim(),
      });
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
  console.log("Form State in EditCotizacion:", form);
  return (
    <Edit setShowEdit={setShowEdit} upDate={editar} deshabilitar={deshabilitar} >
      <div className="p-4">
        <span className="text-3xl ml-6 font-semibold text-blue-500">Editar Cotización</span>
        <CardPlegable title="Proyecto">
          <Proyecto form={form} setForm={setForm} />
        </CardPlegable>
        <CardPlegable title="Control documental">
          <div className="flex flex-wrap gap-4 p-4">
            <label className="flex min-w-56 flex-col gap-1 text-sm font-semibold text-slate-700">
              Fecha de elaboración
              <input className="rounded-lg border border-slate-300 px-3 py-2 font-normal" type="date" value={form.fechaElaboracion ? String(form.fechaElaboracion).slice(0, 10) : ""} onChange={(event) => setForm((current) => ({ ...current, fechaElaboracion: event.target.value }))} />
            </label>
            <div className="min-w-72 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Código actual</p>
              <p>{selected.correlativaVisible}</p>
              <p className="mt-1 text-xs">Al guardar se crea automáticamente la siguiente versión.</p>
            </div>
            <label className="flex min-w-72 flex-col gap-1 text-sm font-semibold text-slate-700">
              Personalizar código (opcional)
              <input className="rounded-lg border border-slate-300 px-3 py-2 font-normal uppercase" value={codigoManual} maxLength={100} placeholder="ECO26-0001-CT-VR00-CLIENTE" onChange={(event) => setCodigoManual(event.target.value.toUpperCase())} />
            </label>
            {codigoManual.trim() && <label className="flex min-w-72 flex-1 flex-col gap-1 text-sm font-semibold text-slate-700">
              Motivo del cambio de código *
              <textarea className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 font-normal" value={motivoCambioCodigo} onChange={(event) => setMotivoCambioCodigo(event.target.value)} />
            </label>}
          </div>
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
