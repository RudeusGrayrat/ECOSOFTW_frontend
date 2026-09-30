import { useState } from "react";
import axios from "../../../../api/axios";
import Edit from "../../../../components/Principal/Permissions/Edit";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";

const inputClass = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500";

const EditInformesEnsayo = ({ selected, setShowEdit, reload }) => {
  const sendMessage = useSendMessage();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    codigo: selected?.codigo || "",
    planMonitoreo: selected?.planMonitoreo || "",
    cliente: selected?.cliente || "",
    matriz: selected?.matriz || "",
    acreditacion: selected?.acreditacion || "SIN_ACREDITACION",
  });

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const save = async () => {
    setSaving(true);
    try {
      const response = await axios.patch(`/calidad/informes-ensayo/${selected._id}`, form);
      sendMessage(response.data.message, response.data.type || "Correcto");
      await reload();
      setShowEdit(false);
    } catch (error) {
      sendMessage(error?.response?.data?.message || "No se pudieron actualizar los datos del informe", "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Edit setShowEdit={setShowEdit} upDate={save} deshabilitar={saving}>
      <div className="mx-auto w-full max-w-3xl p-5">
        <h2 className="text-2xl font-semibold text-slate-800">Corregir datos del informe</h2>
        <p className="mt-2 text-sm text-slate-500">No reemplaza el PDF ni modifica el ID de acceso. Las correcciones quedan registradas en la auditoría.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Código<input className={inputClass} value={form.codigo} onChange={(event) => update("codigo", event.target.value)} /></label>
          <label className="text-sm font-semibold text-slate-700">Plan de monitoreo<input className={inputClass} value={form.planMonitoreo} onChange={(event) => update("planMonitoreo", event.target.value)} /></label>
          <label className="text-sm font-semibold text-slate-700">Cliente<input className={inputClass} value={form.cliente} onChange={(event) => update("cliente", event.target.value)} /></label>
          <label className="text-sm font-semibold text-slate-700">Matriz<input className={inputClass} value={form.matriz} onChange={(event) => update("matriz", event.target.value)} /></label>
          <label className="text-sm font-semibold text-slate-700">Acreditación<select className={inputClass} value={form.acreditacion} onChange={(event) => update("acreditacion", event.target.value)}><option value="INACAL">INACAL</option><option value="NAC">NAC</option><option value="SIN_ACREDITACION">Sin acreditación</option></select></label>
        </div>
      </div>
    </Edit>
  );
};

export default EditInformesEnsayo;
