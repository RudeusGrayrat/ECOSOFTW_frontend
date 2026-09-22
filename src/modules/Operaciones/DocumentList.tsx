import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import axios from "../../api/axios";
import useSendMessage from "../../components/Ui/Messages/sendMessage";
import ReadOrCreate from "../../components/Principal/Principal";
import ListPrincipal from "../../components/Principal/List/List";
import Details from "../../components/Principal/Permissions/View";
import { useAuth } from "../../context/AuthContext";

const field = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm";
const Principal = ReadOrCreate as any;
const PrincipalList = ListPrincipal as any;
const updateArray = (items: any[], index: number, key: string, value: string) => items.map((item, i) => i === index ? { ...item, [key]: key === "cantidad" ? Number(value) : value } : item);
const pdfErrorMessage = async (error: any, endpoint: string) => {
  let payload = error?.response?.data;
  if (payload instanceof Blob) {
    try { payload = JSON.parse(await payload.text()); } catch { payload = null; }
  }
  console.error("[PDF] Falló el documento operativo", { endpoint, status: error?.response?.status, payload });
  return payload?.traceId ? `${payload.message} (Diagnóstico: ${payload.traceId})` : payload?.message || "No se pudo generar el PDF. Verifica la plantilla activa.";
};

const Contexto = ({ form, setForm }: any) => <>
  <div className="mb-6 grid gap-4 md:grid-cols-2">
    <label>Proyecto<input className={field} value={form.proyecto?.nombre || ""} onChange={(e) => setForm({ ...form, proyecto: { ...form.proyecto, nombre: e.target.value } })} /></label>
    <label>Planta<input className={field} value={form.proyecto?.planta || ""} onChange={(e) => setForm({ ...form, proyecto: { ...form.proyecto, planta: e.target.value } })} /></label>
    <label className="md:col-span-2">Condiciones de ingreso<textarea className={field} value={form.condicionesIngreso || ""} onChange={(e) => setForm({ ...form, condicionesIngreso: e.target.value })} /></label>
    <label>Trabajo de alto riesgo<input className={field} value={form.trabajoAltoRiesgo || ""} onChange={(e) => setForm({ ...form, trabajoAltoRiesgo: e.target.value })} /></label>
    <label>Accesibilidad<textarea className={field} value={form.accesibilidadPuntos || ""} onChange={(e) => setForm({ ...form, accesibilidadPuntos: e.target.value })} /></label>
  </div>
  <section className="mb-6"><h3 className="mb-2 font-semibold">Estaciones de monitoreo</h3>{(form.estaciones || []).map((station: any, index: number) => <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-4" key={index}>{["codigo", "este", "norte", "descripcion"].map((key) => <input key={key} className={field} placeholder={key} value={station[key] || ""} onChange={(e) => setForm({ ...form, estaciones: updateArray(form.estaciones, index, key, e.target.value) })} />)}</div>)}</section>
</>;

const Editor = ({ item, kind, onClose, onSaved }: any) => {
  const [form, setForm] = useState(item); const sendMessage = useSendMessage();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  useEffect(() => { if (kind === "plan") axios.get("/herramientas/getUsuariosPaginacion", { params: { limit: 200 } }).then((response) => setUsuarios((response.data.data || []).filter((user: any) => user.estado === "ACTIVO"))); }, [kind]);
  const save = async () => { try { const endpoint = kind === "plan" ? `/operaciones/planes-trabajo/${item._id}` : `/operaciones/ordenes-internas/${item._id}`; const response = await axios.patch(endpoint, form); sendMessage(response.data.message, "Correcto"); onSaved(); onClose(); } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo guardar", "Error"); } };
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 p-4"><div className="mx-auto my-6 max-w-5xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold">Editar {kind === "plan" ? "Plan de Trabajo" : "Orden Interna"}</h2><button onClick={onClose}>Cerrar</button></div>
    {kind === "plan" && <div className="mb-6 grid gap-4 md:grid-cols-2"><label>Analista de Operaciones<select className={field} value={form.analistaOperaciones?._id || form.analistaOperaciones || ""} onChange={(e) => setForm({ ...form, analistaOperaciones: e.target.value })}><option value="">Seleccionar analista registrado</option>{usuarios.map((user) => <option key={user._id} value={user._id}>{user.colaborador || user.userName}</option>)}</select></label><label>Analista no registrado<input className={field} placeholder="Nombre manual, si corresponde" value={form.analistaOperacionesManual || ""} onChange={(e) => setForm({ ...form, analistaOperacionesManual: e.target.value })} /></label><label>Elaborado por<select className={field} value={form.elaboradoPor?._id || form.elaboradoPor || ""} onChange={(e) => setForm({ ...form, elaboradoPor: e.target.value })}><option value="">Seleccionar usuario</option>{usuarios.map((user) => <option key={user._id} value={user._id}>{user.colaborador || user.userName}</option>)}</select></label></div>}
    <Contexto form={form} setForm={setForm} />
    <section><h3 className="mb-2 font-semibold">Monitoreo - Emisión de Informe</h3><div className="space-y-2">{(form.items || []).map((row: any, index: number) => <div className="grid grid-cols-1 gap-2 rounded-lg bg-slate-50 p-3 md:grid-cols-5" key={index}><input className={field} aria-label="Matriz" value={row.matriz || ""} onChange={(e) => setForm({ ...form, items: updateArray(form.items, index, "matriz", e.target.value) })} /><input className={field} aria-label="Parámetro" value={row.parametro || ""} onChange={(e) => setForm({ ...form, items: updateArray(form.items, index, "parametro", e.target.value) })} /><input className={field} aria-label="Metodología" value={row.metodologia || ""} onChange={(e) => setForm({ ...form, items: updateArray(form.items, index, "metodologia", e.target.value) })} /><input className={field} aria-label="Cantidad" type="number" value={row.cantidad || 0} onChange={(e) => setForm({ ...form, items: updateArray(form.items, index, "cantidad", e.target.value) })} /><input className={field} placeholder="Laboratorio" value={row.laboratorio || ""} onChange={(e) => setForm({ ...form, items: updateArray(form.items, index, "laboratorio", e.target.value) })} /></div>)}</div></section>
    <div className="mt-6 flex justify-end gap-3"><button className="rounded-lg px-4 py-2" onClick={onClose}>Cancelar</button><button className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white" onClick={save}>Guardar cambios</button></div>
  </div></div>;
};

const ViewDocumento = ({ selected, setShowDetail, kind }: any) => {
  const [pdfUrl, setPdfUrl] = useState(""); const [loading, setLoading] = useState(false); const sendMessage = useSendMessage();
  const generarPdf = async () => { setLoading(true); const endpoint = kind === "plan" ? `/operaciones/planes-trabajo/${selected._id}/pdf` : `/operaciones/ordenes-internas/${selected._id}/pdf`; try { console.info("[PDF] Solicitando documento operativo", { endpoint, kind, documentId: selected._id }); const response = await axios.post(endpoint, {}, { responseType: "blob" }); const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })); setPdfUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return url; }); console.info("[PDF] Documento operativo generado", { kind, documentId: selected._id, bytes: response.data?.size }); } catch (error: any) { sendMessage(await pdfErrorMessage(error, endpoint), "Error"); } finally { setLoading(false); } };
  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);
  return <Details setShowDetail={setShowDetail}><h2 className="text-2xl font-semibold">{kind === "plan" ? "Plan de Trabajo" : "Orden Interna"}</h2><div className="mt-5 grid gap-3 md:grid-cols-2"><p><strong>Código:</strong> {selected?.codigo}</p><p><strong>Estado:</strong> {selected?.estado}</p><p><strong>Proyecto:</strong> {selected?.proyecto?.nombre}</p><p><strong>Planta:</strong> {selected?.proyecto?.planta || "—"}</p><p className="md:col-span-2"><strong>Ítems:</strong> {selected?.items?.length || 0}</p></div><div className="mt-6 flex gap-3"><button disabled={loading} onClick={generarPdf} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-60">{loading ? "Generando PDF…" : "Generar PDF"}</button>{pdfUrl && <><button onClick={() => window.open(pdfUrl, "_blank")} className="rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-800">Ver PDF</button><a href={pdfUrl} download={`${selected?.codigo || "documento"}.pdf`} className="rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-800">Descargar PDF</a></>}</div></Details>;
};

const Creator = ({ kind }: { kind: "plan" | "orden" }) => {
  const [options, setOptions] = useState<any[]>([]); const [selected, setSelected] = useState(""); const { user } = useAuth() as any; const sendMessage = useSendMessage();
  useEffect(() => { const endpoint = kind === "plan" ? "/comercial/getCotizacionesPaginacion" : "/operaciones/planes-trabajo"; axios.get(endpoint, { params: { page: 0, limit: 100 } }).then((response) => setOptions((response.data.data || []).filter((item: any) => kind === "plan" ? item.estado === "APROBADO" : true))); }, [kind]);
  const create = async () => { try { const endpoint = kind === "plan" ? `/operaciones/planes-trabajo/desde-cotizacion/${selected}` : `/operaciones/ordenes-internas/desde-plan/${selected}`; const response = await axios.post(endpoint, { creadoPor: user?._id }); sendMessage(response.data.message, response.data.type); } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo crear", "Error"); } };
  const label = kind === "plan" ? "Cotización aprobada" : "Plan de Trabajo";
  return <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg"><h2 className="text-xl font-semibold">Crear {kind === "plan" ? "Plan de Trabajo" : "Orden Interna"}</h2><p className="mt-2 text-sm text-slate-500">{kind === "plan" ? "El plan se genera con la información aprobada de la cotización." : "La orden toma solo los ítems tercerizados del Plan seleccionado."}</p><label className="mt-5 block text-sm font-medium">{label}<select className={`${field} mt-2`} value={selected} onChange={(e) => setSelected(e.target.value)}><option value="">Seleccionar</option>{options.map((item) => <option value={item._id} key={item._id}>{item.codigo || item.correlativaVisible}</option>)}</select></label><button disabled={!selected} onClick={create} className="mt-5 rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white disabled:opacity-50">Crear</button></div>;
};

const ListDocumentos = ({ kind, permissionEdit, permissionRead }: any) => {
  const endpoint = kind === "plan" ? "/operaciones/planes-trabajo" : "/operaciones/ordenes-internas";
  const fetchData = async (page = 0, limit = 10, search = "") => { const response = await axios.get(endpoint); const needle = search.toLowerCase(); const filtered = (response.data.data || []).filter((item: any) => `${item.codigo} ${item.estado} ${item.proyecto?.nombre || ""}`.toLowerCase().includes(needle)); return { data: filtered.slice(page * limit, (page + 1) * limit), total: filtered.length }; };
  const EditItem = (props: any) => <Editor item={props.selected} kind={kind} onClose={() => props.setShowEdit(false)} onSaved={props.reload} />;
  const DetailItem = (props: any) => <ViewDocumento {...props} kind={kind} />;
  return <PrincipalList permissionEdit={permissionEdit} permissionRead={permissionRead} EditItem={EditItem} DetailItem={DetailItem} fetchData={fetchData} title={`operaciones_${kind}`}><Column field="codigo" header="Código" style={{ paddingLeft: "60px" }} /><Column field="proyecto.nombre" header="Proyecto" /><Column field="estado" header="Estado" /><Column body={(row: any) => row.items?.length || 0} header="Ítems" /></PrincipalList>;
};

export const PlanesTrabajo = () => <Principal ItemList={(props: any) => <ListDocumentos {...props} kind="plan" />} ItemRegister={() => <Creator kind="plan" />} submodule="PLANES DE TRABAJO" />;
export const OrdenesInternas = () => <Principal ItemList={(props: any) => <ListDocumentos {...props} kind="orden" />} ItemRegister={() => <Creator kind="orden" />} submodule="ORDENES INTERNAS" />;
