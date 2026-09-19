import { useState } from "react";
import { Column } from "primereact/column";
import axios from "../../../api/axios";
import ReadOrCreate from "../../../components/Principal/Principal";
import ListPrincipal from "../../../components/Principal/List/List";
import Edit from "../../../components/Principal/Permissions/Edit";
import Details from "../../../components/Principal/Permissions/View";
import useSendMessage from "../../../components/Ui/Messages/sendMessage";

const field = "w-full rounded-lg border border-slate-200 px-3 py-2";
const Principal = ReadOrCreate as any;
const PrincipalList = ListPrincipal as any;

const RegisterProveedor = () => {
  const [nombre, setNombre] = useState(""); const sendMessage = useSendMessage();
  const crear = async () => { try { const response = await axios.post("/comercial/proveedores", { nombre }); setNombre(""); sendMessage(response.data.message, response.data.type); } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo crear el proveedor", "Error"); } };
  return <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg"><h2 className="mb-4 text-xl font-semibold">Registrar proveedor</h2><label className="block text-sm font-medium">Nombre del laboratorio o proveedor<input className={`${field} mt-2`} value={nombre} onChange={(e) => setNombre(e.target.value)} /></label><button className="mt-5 rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white" onClick={crear}>Registrar</button></div>;
};

const ViewProveedor = ({ selected, setShowDetail }: any) => <Details setShowDetail={setShowDetail}><h2 className="text-2xl font-semibold">Proveedor</h2><div className="mt-5 grid gap-3"><p><strong>Nombre:</strong> {selected?.nombre}</p><p><strong>Estado:</strong> {selected?.estado}</p></div></Details>;

const EditProveedor = ({ selected, setShowEdit, reload }: any) => {
  const [form, setForm] = useState({ nombre: selected.nombre || "", estado: selected.estado || "ACTIVO" }); const sendMessage = useSendMessage();
  const guardar = async () => { try { const response = await axios.patch(`/comercial/proveedores/${selected._id}`, form); sendMessage(response.data.message, response.data.type); await reload(); setShowEdit(false); } catch (error: any) { sendMessage(error?.response?.data?.message || "No se pudo actualizar", "Error"); } };
  return <Edit setShowEdit={setShowEdit} upDate={guardar} deshabilitar={false}><div className="p-5"><h2 className="mb-5 text-2xl font-semibold">Editar proveedor</h2><label className="block">Nombre<input className={`${field} mt-2`} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label><label className="mt-4 block">Estado<select className={`${field} mt-2`} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}><option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option></select></label></div></Edit>;
};

const ListProveedores = ({ permissionEdit, permissionRead }: any) => {
  const fetchData = async (page = 0, limit = 10, search = "") => {
    const response = await axios.get("/comercial/proveedores", { params: { todos: true } });
    const needle = search.toLowerCase(); const filtered = (response.data.data || []).filter((item: any) => `${item.nombre} ${item.estado}`.toLowerCase().includes(needle));
    return { data: filtered.slice(page * limit, (page + 1) * limit), total: filtered.length };
  };
  return <PrincipalList permissionEdit={permissionEdit} permissionRead={permissionRead} EditItem={EditProveedor} DetailItem={ViewProveedor} fetchData={fetchData} title="comercial_proveedores"><Column field="nombre" header="Proveedor" style={{ paddingLeft: "60px" }} /><Column field="estado" header="Estado" /></PrincipalList>;
};

const Proveedores = () => <Principal ItemList={ListProveedores} ItemRegister={RegisterProveedor} submodule="PROVEEDORES" />;
export default Proveedores;
