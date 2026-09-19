import { useState } from "react";
import { Column } from "primereact/column";
import axios from "../../../api/axios";
import ReadOrCreate from "../../../components/Principal/Principal";
import ListPrincipal from "../../../components/Principal/List/List";
import Edit from "../../../components/Principal/Permissions/Edit";
import Details from "../../../components/Principal/Permissions/View";
import useSendMessage from "../../../components/Ui/Messages/sendMessage";

const field = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm";
const Principal = ReadOrCreate as any;
const PrincipalList = ListPrincipal as any;
const tipos: Record<string, string> = { COTIZACION: "Cotizacion", PLAN_TRABAJO: "Plan de Trabajo", ORDEN_INTERNA: "Orden Interna" };

const dataFor = (form: any) => {
  const data = new FormData();
  ["tipo", "nombre", "version", "vigenciaDesde", "estado"].forEach((key) => form[key] !== undefined && data.append(key, form[key]));
  if (form.archivo) data.append("archivo", form.archivo);
  return data;
};

const FormularioPlantilla = () => {
  const [form, setForm] = useState({ tipo: "COTIZACION", nombre: "", version: "", vigenciaDesde: "", estado: "ACTIVA", archivo: null as File | null });
  const sendMessage = useSendMessage();
  const guardar = async () => {
    if (!form.archivo) return sendMessage("Selecciona una plantilla Word .docx", "Advertencia");
    try { const response = await axios.post("/herramientas/plantillas-documentales", dataFor(form)); setForm({ tipo: "COTIZACION", nombre: "", version: "", vigenciaDesde: "", estado: "ACTIVA", archivo: null }); sendMessage(response.data.message, response.data.type); }
    catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo guardar la plantilla", "Error"); }
  };
  return <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-lg"><h2 className="text-xl font-semibold">Cargar plantilla documental</h2><p className="mt-2 text-sm text-slate-500">Carga un Word .docx con etiquetas Docxtemplater. La plantilla activa se usará para generar el PDF del documento seleccionado.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><label>Documento<select className={field} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>{Object.entries(tipos).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Nombre interno<input className={field} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Formato comercial 2026" /></label><label>Version<input className={field} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="V1.0" /></label><label>Vigente desde<input type="date" className={field} value={form.vigenciaDesde} onChange={(e) => setForm({ ...form, vigenciaDesde: e.target.value })} /></label><label className="md:col-span-2">Archivo Word (.docx)<input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className={field} onChange={(e) => setForm({ ...form, archivo: e.target.files?.[0] || null })} /></label></div><button onClick={guardar} className="mt-6 rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white">Guardar plantilla</button></div>;
};

const ViewPlantilla = ({ selected, setShowDetail }: any) => <Details setShowDetail={setShowDetail}><h2 className="text-2xl font-semibold">Plantilla documental</h2><div className="mt-5 grid gap-3"><p><strong>Documento:</strong> {tipos[selected?.tipo] || selected?.tipo}</p><p><strong>Nombre:</strong> {selected?.nombre}</p><p><strong>Version:</strong> {selected?.version}</p><p><strong>Archivo:</strong> {selected?.nombreOriginal}</p><p><strong>Estado:</strong> {selected?.estado}</p><p><strong>Actualizada por:</strong> {selected?.actualizadoPor?.colaborador || selected?.actualizadoPor?.userName || "—"}</p></div></Details>;

const EditPlantilla = ({ selected, setShowEdit, reload }: any) => {
  const [form, setForm] = useState({ nombre: selected.nombre || "", version: selected.version || "", vigenciaDesde: selected.vigenciaDesde ? selected.vigenciaDesde.slice(0, 10) : "", estado: selected.estado || "ACTIVA", archivo: null as File | null }); const sendMessage = useSendMessage();
  const guardar = async () => { try { const response = await axios.patch(`/herramientas/plantillas-documentales/${selected._id}`, dataFor(form)); sendMessage(response.data.message, response.data.type); await reload(); setShowEdit(false); } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo actualizar", "Error"); } };
  return <Edit setShowEdit={setShowEdit} upDate={guardar} deshabilitar={false}><div className="p-5"><h2 className="text-2xl font-semibold">Editar plantilla</h2><div className="mt-5 grid gap-4"><label>Nombre<input className={field} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label><label>Version<input className={field} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} /></label><label>Vigente desde<input type="date" className={field} value={form.vigenciaDesde} onChange={(e) => setForm({ ...form, vigenciaDesde: e.target.value })} /></label><label>Estado<select className={field} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}><option value="ACTIVA">ACTIVA</option><option value="INACTIVA">INACTIVA</option></select></label><label>Reemplazar archivo (opcional)<input className={field} type="file" accept=".docx" onChange={(e) => setForm({ ...form, archivo: e.target.files?.[0] || null })} /></label></div></div></Edit>;
};

const ListPlantillas = ({ permissionEdit, permissionRead }: any) => {
  const fetchData = async (page = 0, limit = 10, search = "") => { const response = await axios.get("/herramientas/plantillas-documentales"); const needle = search.toLowerCase(); const filtered = (response.data.data || []).filter((row: any) => `${row.nombre} ${row.tipo} ${row.version} ${row.estado}`.toLowerCase().includes(needle)); return { data: filtered.slice(page * limit, (page + 1) * limit), total: filtered.length }; };
  return <PrincipalList permissionEdit={permissionEdit} permissionRead={permissionRead} EditItem={EditPlantilla} DetailItem={ViewPlantilla} fetchData={fetchData} title="configuracion_plantillas"><Column body={(row: any) => tipos[row.tipo] || row.tipo} header="Documento" style={{ paddingLeft: "60px" }} /><Column field="nombre" header="Nombre" /><Column field="version" header="Version" /><Column field="estado" header="Estado" /></PrincipalList>;
};

const PlantillasDocumentales = () => <Principal ItemList={ListPlantillas} ItemRegister={FormularioPlantilla} submodule="PLANTILLAS" />;
export default PlantillasDocumentales;
