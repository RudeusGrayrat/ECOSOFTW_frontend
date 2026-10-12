import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import axios from "../../../api/axios";
import useSendMessage from "../../../components/Ui/Messages/sendMessage";
import departmentsRaw from "./ubicacion-departamentos.json?raw";
import provincesRaw from "./ubicacion-provincias.json?raw";
import districtsRaw from "./ubicacion-distritos.json?raw";

type Ubigeo = { id_ubigeo: string; nombre_ubigeo: string; id_padre_ubigeo: string };
type Parameter = { _id: string; tipoDeAnalisis: string; parametro: string; categoria?: string; metodo?: string };
type Station = { codigo: string; este: string; norte: string; descripcion: string };
type ParameterRequest = { parametro_id: string; cantidadPuntos: number };
type LookupData = { razonSocial?: string; direccionLegal?: string; fuente?: string; departamento?: string; provincia?: string; distrito?: string };
type RequestForm = {
  tipoCliente: "EMPRESA" | "PERSONA"; cliente: string; numeroDocumento: string; direccionLegal: string; proyecto: string; nombrePlanta: string; referenciaLugar: string;
  ubicacion: { departamentoId: string; departamento: string; provinciaId: string; provincia: string; distritoId: string; distrito: string };
  servicios: string[]; frecuenciaAire: string; parametrosSolicitados: ParameterRequest[]; metodologiaParametros: string; fechaServicio: string; tipoDocumento: string[];
  requisitosIngreso: string[]; induccionHoras: string; peligrosEspecificos: string[]; condicionesIngreso: string; trabajoAltoRiesgo: string; accesibilidadPuntos: string;
  zonaUtm: string; datum: string; destinatarioInforme: { razonSocial: string; ruc: string }; contacto: { nombreCompleto: string; cargo: string; telefono: string; correo: string }; estaciones: Station[];
};

const departments = JSON.parse(departmentsRaw) as Ubigeo[];
const provinces = JSON.parse(provincesRaw) as Record<string, Ubigeo[]>;
const districts = JSON.parse(districtsRaw) as Record<string, Ubigeo[]>;
const services = ["AIRE", "AGUA", "SUELO", "RUIDO", "SALUD OCUPACIONAL"];
const documentTypes = ["INFORME DE MONITOREO AMBIENTAL", "INFORME DE ENSAYO"];
const entryRequirements = ["SCTR obligatorio (salud y pensión)", "EMO específico", "Altura o espacios confinados", "Inducción previa"];
const riskOptions = ["Trabajo en altura", "Trabajo en caliente", "Trabajo eléctrico", "Izaje"];
const matrixForService = (service: string) => service === "SALUD OCUPACIONAL" ? "MONITOREO OCUPACIONAL" : service;
const normalizedName = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
const initialForm = (): RequestForm => ({
  tipoCliente: "EMPRESA", cliente: "", numeroDocumento: "", direccionLegal: "", proyecto: "", nombrePlanta: "", referenciaLugar: "",
  ubicacion: { departamentoId: "", departamento: "", provinciaId: "", provincia: "", distritoId: "", distrito: "" },
  servicios: [], frecuenciaAire: "", parametrosSolicitados: [], metodologiaParametros: "", fechaServicio: "", tipoDocumento: [],
  requisitosIngreso: [], induccionHoras: "", peligrosEspecificos: [], condicionesIngreso: "", trabajoAltoRiesgo: "NO", accesibilidadPuntos: "", zonaUtm: "", datum: "",
  destinatarioInforme: { razonSocial: "", ruc: "" }, contacto: { nombreCompleto: "", cargo: "", telefono: "", correo: "" }, estaciones: [{ codigo: "", este: "", norte: "", descripcion: "" }],
});

const Label = ({ children }: { children: ReactNode }) => <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{children}</label>;
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100";
const Input = ({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => {
  const placeholder = label === "Nombre del proyecto" ? "Ejm.: Según cadena..." : props.placeholder;
  return <div><Label>{label}</Label><input className={inputClass} {...props} placeholder={placeholder} /></div>;
};
const Textarea = ({ label, ...props }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) => <div><Label>{label}</Label><textarea className={`${inputClass} min-h-24 resize-y`} {...props} /></div>;
const Choice = ({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) => <button type="button" onClick={onClick} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition ${active ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600 hover:border-emerald-300"}`}>{children}</button>;

const FormClientes = () => {
  const [form, setForm] = useState<RequestForm>(initialForm);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loadingParameters, setLoadingParameters] = useState(true);
  const [consultingRuc, setConsultingRuc] = useState(false);
  const [sameRecipient, setSameRecipient] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  // Evita que una consulta iniciada para un documento anterior escriba datos al cambiar de cliente.
  const lookupVersion = useRef(0);
  const sendMessage = useSendMessage();
  const includesAir = form.servicios.includes("AIRE");
  const selectedProvinces = provinces[form.ubicacion.departamentoId] || [];
  const selectedDistricts = districts[form.ubicacion.provinciaId] || [];
  const parameterById = useMemo(() => new Map(parameters.map((item) => [item._id, item])), [parameters]);
  const technicalSummary = useMemo(() => form.parametrosSolicitados.map((request) => {
    const parameter = parameterById.get(request.parametro_id);
    return parameter ? `${parameter.tipoDeAnalisis}: ${parameter.parametro} (${request.cantidadPuntos} punto${request.cantidadPuntos === 1 ? "" : "s"})` : "";
  }).filter(Boolean).join(" · "), [form.parametrosSolicitados, parameterById]);
  const completion = useMemo(() => {
    const required = [form.cliente, form.numeroDocumento, form.ubicacion.departamento, form.ubicacion.provincia, form.ubicacion.distrito, form.fechaServicio, form.contacto.nombreCompleto, form.contacto.telefono, form.contacto.correo, form.servicios.length];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [form]);

  useEffect(() => {
    let current = true;
    axios.get("/comercial/getParametrosPaginacion", { params: { page: 0, limit: 1000 }, globalFeedback: false })
      .then((response) => { if (current) setParameters(response.data?.data || []); })
      .catch(() => { if (current) sendMessage("No pudimos cargar el catálogo de parámetros. Puedes describir tu requerimiento en observaciones.", "Advertencia"); })
      .finally(() => { if (current) setLoadingParameters(false); });
    return () => { current = false; };
  }, [sendMessage]);

  useEffect(() => {
    if (!sameRecipient) return;
    setForm((current) => ({ ...current, destinatarioInforme: { razonSocial: current.cliente, ruc: current.numeroDocumento } }));
  }, [sameRecipient, form.cliente, form.numeroDocumento]);

  const toggle = (key: "servicios" | "tipoDocumento" | "requisitosIngreso" | "peligrosEspecificos", value: string) => {
    setForm((current) => {
      const selected = current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value];
      const next = { ...current, [key]: selected };
      if (key === "servicios") {
        const validMatrices = new Set(selected.map(matrixForService));
        next.parametrosSolicitados = current.parametrosSolicitados.filter((request) => validMatrices.has(parameterById.get(request.parametro_id)?.tipoDeAnalisis || ""));
      }
      return next;
    });
  };
  const updateStation = (index: number, key: keyof Station, value: string) => setForm((current) => ({ ...current, estaciones: current.estaciones.map((station, i) => i === index ? { ...station, [key]: value } : station) }));
  const chooseDepartment = (id: string) => {
    const selected = departments.find((item) => item.id_ubigeo === id);
    setForm((current) => ({ ...current, ubicacion: { departamentoId: id, departamento: selected?.nombre_ubigeo || "", provinciaId: "", provincia: "", distritoId: "", distrito: "" } }));
  };
  const chooseProvince = (id: string) => {
    const selected = selectedProvinces.find((item) => item.id_ubigeo === id);
    setForm((current) => ({ ...current, ubicacion: { ...current.ubicacion, provinciaId: id, provincia: selected?.nombre_ubigeo || "", distritoId: "", distrito: "" } }));
  };
  const chooseDistrict = (id: string) => {
    const selected = selectedDistricts.find((item) => item.id_ubigeo === id);
    setForm((current) => ({ ...current, ubicacion: { ...current.ubicacion, distritoId: id, distrito: selected?.nombre_ubigeo || "" } }));
  };
  const changeCustomerType = (tipoCliente: RequestForm["tipoCliente"]) => {
    lookupVersion.current += 1;
    setConsultingRuc(false);
    setSameRecipient(false);
    // Empresa y persona son solicitudes distintas: no debe sobrevivir ningún dato previo.
    setForm({ ...initialForm(), tipoCliente });
    setFiles([]);
    setFileInputKey((current) => current + 1);
    if (tipoCliente === "PERSONA") {
      sendMessage("RENIEC completa el nombre asociado al DNI. El departamento, provincia y distrito corresponden al lugar del servicio y se indican manualmente.", "Información");
    }
  };
  const addParameter = (id: string) => {
    if (!id) return;
    setForm((current) => current.parametrosSolicitados.some((request) => request.parametro_id === id) ? current : { ...current, parametrosSolicitados: [...current.parametrosSolicitados, { parametro_id: id, cantidadPuntos: 1 }] });
  };
  const updateParameterPoints = (id: string, value: string) => setForm((current) => ({ ...current, parametrosSolicitados: current.parametrosSolicitados.map((request) => request.parametro_id === id ? { ...request, cantidadPuntos: Math.max(1, Number(value) || 1) } : request) }));
  const consultaRuc = async () => {
    const documentNumber = form.numeroDocumento.replace(/\D/g, "");
    const validLength = form.tipoCliente === "EMPRESA" ? 11 : 8;
    if (documentNumber.length !== validLength) return;
    const lookupId = ++lookupVersion.current;
    const requestedType = form.tipoCliente;
    setConsultingRuc(true);
    try {
      const response = await axios.get(`/comercial/consulta-documento/${documentNumber}`, { globalFeedback: false });
      const data = (response.data?.data || {}) as LookupData;
      setForm((current) => {
        // Al perder foco, el input puede iniciar una consulta justo antes de cambiar el tipo.
        // Solo aceptamos la respuesta si el formulario todavía representa ese mismo documento.
        if (lookupId !== lookupVersion.current || current.tipoCliente !== requestedType || current.numeroDocumento !== documentNumber) return current;
        const department = departments.find((item) => normalizedName(item.nombre_ubigeo) === normalizedName(data.departamento || ""));
        const province = department ? (provinces[department.id_ubigeo] || []).find((item) => normalizedName(item.nombre_ubigeo) === normalizedName(data.provincia || "")) : undefined;
        const district = province ? (districts[province.id_ubigeo] || []).find((item) => normalizedName(item.nombre_ubigeo) === normalizedName(data.distrito || "")) : undefined;
        const ubicacion = department && province && district
          ? { departamentoId: department.id_ubigeo, departamento: department.nombre_ubigeo, provinciaId: province.id_ubigeo, provincia: province.nombre_ubigeo, distritoId: district.id_ubigeo, distrito: district.nombre_ubigeo }
          : current.ubicacion;
        return { ...current, cliente: data.razonSocial || current.cliente, direccionLegal: data.direccionLegal || current.direccionLegal, ubicacion };
      });
      if (lookupId !== lookupVersion.current) return;
      sendMessage(
        data.fuente === "ECOSOFT"
          ? "Completamos los datos desde ECOSOFT."
          : data.fuente === "RENIEC"
            ? "Nombre completado desde RENIEC."
            : `Completamos los datos consultados en ${data.fuente || "la fuente externa"}.`,
        "Correcto"
      );
    } catch (error: unknown) {
      const responseData = (typeof error === "object" && error !== null && "response" in error)
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      sendMessage(responseData?.message || "No pudimos consultar el documento. Puedes continuar manualmente.", "Advertencia");
    } finally {
      if (lookupId === lookupVersion.current) setConsultingRuc(false);
    }
  };
  const selectFiles = (incoming: FileList | null) => {
    const next = Array.from(incoming || []);
    const valid = next.filter((file) => /\.(pdf|doc|docx)$/i.test(file.name) && file.size <= 10 * 1024 * 1024).slice(0, 5);
    if (valid.length !== next.length) sendMessage("Solo se aceptan hasta 5 archivos PDF, DOC o DOCX de máximo 10 MB cada uno.", "Advertencia");
    setFiles(valid);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.cliente || !form.numeroDocumento || !form.ubicacion.departamento || !form.ubicacion.provincia || !form.ubicacion.distrito || !form.fechaServicio || !form.servicios.length || !form.contacto.nombreCompleto || !form.contacto.telefono || !form.contacto.correo) {
      sendMessage("Completa los campos obligatorios antes de enviar la solicitud.", "Advertencia");
      return;
    }
    if (includesAir && !form.frecuenciaAire) { sendMessage("Selecciona la frecuencia para el monitoreo de aire.", "Advertencia"); return; }
    const location = [form.ubicacion.distrito, form.ubicacion.provincia, form.ubicacion.departamento, form.referenciaLugar].filter(Boolean).join(", ");
    const payload = new FormData();
    const values = { ...form, proyecto: form.proyecto.trim(), ubicacion: { ...form.ubicacion, referencia: form.referenciaLugar }, lugarEjecucion: location, cantidadPuntosParametros: technicalSummary || form.metodologiaParametros };
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === "string") payload.append(key, value);
      else payload.append(key, JSON.stringify(value));
    });
    files.forEach((file) => payload.append("adjuntos", file));
    try {
      await axios.post("/comercial/postFormularioCotizacion", payload);
      setForm(initialForm()); setFiles([]); setFileInputKey((current) => current + 1); setSameRecipient(false);
    } catch { /* El interceptor global muestra el motivo y mantiene los datos para reintentar. */ }
  };

  return <main className="min-h-screen bg-[#f5f8f7] px-4 py-8 sm:px-8 lg:py-12"><div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-[0_24px_80px_rgba(15,49,42,0.12)]">
    <header className="relative overflow-hidden bg-[#103f37] px-6 py-9 text-white sm:px-10"><div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/15" /><div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Ecology · atención comercial</p><h1 className="text-3xl font-semibold sm:text-4xl">Cuéntanos sobre tu monitoreo</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/80">Usaremos esta información para preparar tu cotización y, cuando corresponda, el plan de trabajo.</p></div><div className="min-w-40 rounded-2xl bg-white/10 p-4 backdrop-blur"><div className="flex justify-between text-xs text-emerald-100"><span>Avance</span><span>{completion}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-emerald-300 transition-all" style={{ width: `${completion}%` }} /></div></div></div></header>
    <form onSubmit={submit} className="space-y-8 p-5 [&_button:not(:disabled)]:cursor-pointer [&_select:not(:disabled)]:cursor-pointer sm:p-8 lg:p-10">
      <section className="grid gap-5 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3"><div className="sm:col-span-2 lg:col-span-3"><p className="text-lg font-semibold text-slate-800">1. Datos de la empresa y proyecto</p><p className="mt-1 text-sm text-slate-500">Identificamos al solicitante y la ubicación exacta del servicio.</p></div><div><Label>Tipo de cliente</Label><select className={inputClass} value={form.tipoCliente} onChange={(event) => changeCustomerType(event.target.value as RequestForm["tipoCliente"])}><option value="EMPRESA">Empresa</option><option value="PERSONA">Persona</option></select></div><div><Label>{form.tipoCliente === "EMPRESA" ? "RUC *" : "DNI *"}</Label><div className="flex gap-2"><input className={inputClass} inputMode="numeric" value={form.numeroDocumento} onChange={(event) => { lookupVersion.current += 1; setConsultingRuc(false); setForm({ ...form, numeroDocumento: event.target.value.replace(/\D/g, "") }); }} onBlur={consultaRuc} /><button type="button" disabled={consultingRuc || form.numeroDocumento.length !== (form.tipoCliente === "EMPRESA" ? 11 : 8)} onClick={consultaRuc} className="rounded-xl border border-emerald-600 px-3 text-xs font-bold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">{consultingRuc ? "…" : "Consultar"}</button></div></div><Input label={form.tipoCliente === "EMPRESA" ? "Razón social *" : "Nombre completo *"} value={form.cliente} onChange={(event) => setForm({ ...form, cliente: event.target.value })} /><Input label="Nombre del proyecto" placeholder="Si no lo tienes, usaremos 'Según cadena de custodia'" value={form.proyecto} onChange={(event) => setForm({ ...form, proyecto: event.target.value })} /><Input label="Nombre de la planta" value={form.nombrePlanta} onChange={(event) => setForm({ ...form, nombrePlanta: event.target.value })} /><Input label="Dirección legal" value={form.direccionLegal} onChange={(event) => setForm({ ...form, direccionLegal: event.target.value })} /><div><Label>Departamento *</Label><select className={inputClass} value={form.ubicacion.departamentoId} onChange={(event) => chooseDepartment(event.target.value)}><option value="">Selecciona</option>{departments.map((item) => <option key={item.id_ubigeo} value={item.id_ubigeo}>{item.nombre_ubigeo}</option>)}</select></div><div><Label>Provincia *</Label><select disabled={!form.ubicacion.departamentoId} className={inputClass} value={form.ubicacion.provinciaId} onChange={(event) => chooseProvince(event.target.value)}><option value="">Selecciona</option>{selectedProvinces.map((item) => <option key={item.id_ubigeo} value={item.id_ubigeo}>{item.nombre_ubigeo}</option>)}</select></div><div><Label>Distrito *</Label><select disabled={!form.ubicacion.provinciaId} className={inputClass} value={form.ubicacion.distritoId} onChange={(event) => chooseDistrict(event.target.value)}><option value="">Selecciona</option>{selectedDistricts.map((item) => <option key={item.id_ubigeo} value={item.id_ubigeo}>{item.nombre_ubigeo}</option>)}</select></div><div className="sm:col-span-2 lg:col-span-3"><Input label="Referencia o lugar específico de ejecución" placeholder="Planta, unidad, vía de acceso o referencia adicional" value={form.referenciaLugar} onChange={(event) => setForm({ ...form, referenciaLugar: event.target.value })} /></div></section>

      <section className="rounded-2xl border border-slate-100 p-5"><p className="text-lg font-semibold text-slate-800">2. Servicio solicitado</p><p className="mt-1 text-sm text-slate-500">Selecciona las matrices y luego los parámetros del catálogo. Puedes añadir varios.</p><div className="mt-5 flex flex-wrap gap-3">{services.map((service) => <Choice key={service} active={form.servicios.includes(service)} onClick={() => toggle("servicios", service)}>{service}</Choice>)}</div><div className="mt-6 grid gap-5 md:grid-cols-2"><Input label="Fecha prevista del servicio *" type="date" value={form.fechaServicio} onChange={(event) => setForm({ ...form, fechaServicio: event.target.value })} />{includesAir && <div><Label>Frecuencia para aire *</Label><select className={inputClass} value={form.frecuenciaAire} onChange={(event) => setForm({ ...form, frecuenciaAire: event.target.value })}><option value="">Selecciona una frecuencia</option><option value="24 HORAS">24 horas</option><option value="5 DIAS">5 días</option></select></div>}</div>
        {!!form.servicios.length && <div className="mt-6 rounded-2xl bg-emerald-50/60 p-4"><div className="mb-3 flex items-center justify-between"><div><p className="font-semibold text-emerald-950">Parámetros y cantidad de puntos</p><p className="text-xs text-emerald-800/70">Esta selección será revisada por Comercial antes de confirmar el alcance.</p></div>{loadingParameters && <span className="text-xs text-emerald-700">Cargando catálogo…</span>}</div><div className="grid gap-3 md:grid-cols-2">{form.servicios.map((service) => { const options = parameters.filter((item) => item.tipoDeAnalisis === matrixForService(service)); return <div key={service}><Label>{service}</Label><select disabled={loadingParameters || !options.length} className={inputClass} defaultValue="" onChange={(event) => { addParameter(event.target.value); event.currentTarget.value = ""; }}><option value="">{options.length ? "Agregar parámetro" : "Sin parámetros registrados"}</option>{options.map((item) => <option key={item._id} value={item._id}>{item.parametro}{item.categoria ? ` · ${item.categoria}` : ""}</option>)}</select></div>; })}</div>{form.parametrosSolicitados.length > 0 && <div className="mt-4 space-y-2">{form.parametrosSolicitados.map((request) => { const parameter = parameterById.get(request.parametro_id); if (!parameter) return null; return <div key={request.parametro_id} className="grid items-center gap-3 rounded-xl border border-emerald-100 bg-white p-3 md:grid-cols-[1fr_8rem_auto]"><div><p className="text-sm font-semibold text-slate-800">{parameter.parametro}</p><p className="text-xs text-slate-500">{parameter.tipoDeAnalisis}{parameter.metodo ? ` · ${parameter.metodo}` : ""}</p></div><Input label="Puntos" type="number" min="1" value={request.cantidadPuntos} onChange={(event) => updateParameterPoints(request.parametro_id, event.target.value)} /><button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600" onClick={() => setForm((current) => ({ ...current, parametrosSolicitados: current.parametrosSolicitados.filter((item) => item.parametro_id !== request.parametro_id) }))}>Quitar</button></div>; })}</div>}<Textarea label="Observaciones o requerimientos técnicos adicionales" placeholder="Describe parámetros no listados, metodología solicitada u otra condición técnica." value={form.metodologiaParametros} onChange={(event) => setForm({ ...form, metodologiaParametros: event.target.value })} /></div>}
        <div className="mt-5"><Label>Documento requerido</Label><div className="flex flex-wrap gap-3">{documentTypes.map((type) => <Choice key={type} active={form.tipoDocumento.includes(type)} onClick={() => toggle("tipoDocumento", type)}>{type}</Choice>)}</div></div><div className="mt-5"><Label>Adjuntos opcionales</Label><input key={fileInputKey} className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-800`} type="file" multiple accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => selectFiles(event.target.files)} /><p className="mt-2 text-xs text-slate-500">Adjunta TDR, IGA o requerimientos previos. Máximo 5 archivos de 10 MB cada uno.</p>{files.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{files.map((file) => <span key={`${file.name}-${file.size}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{file.name}</span>)}</div>}</div></section>

      <section className="grid gap-5 rounded-2xl bg-amber-50/60 p-5 md:grid-cols-2"><div className="md:col-span-2"><p className="text-lg font-semibold text-slate-800">3. Condiciones de ingreso y seguridad</p><p className="mt-1 text-sm text-slate-500">Marca lo que aplique y añade cualquier indicación particular.</p></div><div className="md:col-span-2"><Label>Requisitos de ingreso</Label><div className="flex flex-wrap gap-2">{entryRequirements.map((item) => <Choice key={item} active={form.requisitosIngreso.includes(item)} onClick={() => toggle("requisitosIngreso", item)}>{item}</Choice>)}</div></div>{form.requisitosIngreso.includes("Inducción previa") && <Input label="Duración de inducción (horas)" type="number" min="0" value={form.induccionHoras} onChange={(event) => setForm({ ...form, induccionHoras: event.target.value })} />}<div><Label>¿Existe trabajo de alto riesgo?</Label><select className={inputClass} value={form.trabajoAltoRiesgo} onChange={(event) => setForm({ ...form, trabajoAltoRiesgo: event.target.value, peligrosEspecificos: event.target.value === "SI" ? form.peligrosEspecificos : [] })}><option value="NO">No</option><option value="SI">Sí</option><option value="POR CONFIRMAR">Por confirmar</option></select></div>{form.trabajoAltoRiesgo === "SI" && <div className="md:col-span-2"><Label>Peligros específicos</Label><div className="flex flex-wrap gap-2">{riskOptions.map((item) => <Choice key={item} active={form.peligrosEspecificos.includes(item)} onClick={() => toggle("peligrosEspecificos", item)}>{item}</Choice>)}</div></div>}<Textarea label="Condiciones adicionales de ingreso" placeholder="Permisos, EPP, documentos de seguridad u otros requisitos." value={form.condicionesIngreso} onChange={(event) => setForm({ ...form, condicionesIngreso: event.target.value })} /><Textarea label="Accesibilidad de los puntos" placeholder="Terreno, rutas, restricciones horarias, cableado eléctrico u otros factores." value={form.accesibilidadPuntos} onChange={(event) => setForm({ ...form, accesibilidadPuntos: event.target.value })} /></section>

      <section className="rounded-2xl border border-slate-100 p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-lg font-semibold text-slate-800">4. Estaciones de monitoreo</p><p className="text-sm text-slate-500">Incluye las coordenadas disponibles o agrega el detalle en un archivo.</p></div><button type="button" className="rounded-xl border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700" onClick={() => setForm({ ...form, estaciones: [...form.estaciones, { codigo: "", este: "", norte: "", descripcion: "" }] })}>+ Agregar estación</button></div><div className="mt-5 grid gap-5 md:grid-cols-2"><div><Label>Zona UTM</Label><select className={inputClass} value={form.zonaUtm} onChange={(event) => setForm({ ...form, zonaUtm: event.target.value })}><option value="">Selecciona si aplica</option><option>17S</option><option>18S</option><option>19S</option></select></div><div><Label>Datum</Label><select className={inputClass} value={form.datum} onChange={(event) => setForm({ ...form, datum: event.target.value })}><option value="">Selecciona si aplica</option><option>WGS84</option><option>PSAD56</option></select></div></div><div className="mt-5 space-y-4">{form.estaciones.map((station, index) => <div key={index} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_1fr_2fr_auto]"><Input label="Código" value={station.codigo} onChange={(event) => updateStation(index, "codigo", event.target.value)} /><Input label="Este" value={station.este} onChange={(event) => updateStation(index, "este", event.target.value)} /><Input label="Norte" value={station.norte} onChange={(event) => updateStation(index, "norte", event.target.value)} /><Input label="Descripción" value={station.descripcion} onChange={(event) => updateStation(index, "descripcion", event.target.value)} />{form.estaciones.length > 1 && <button type="button" className="self-end rounded-lg px-3 py-3 text-sm font-semibold text-rose-600" onClick={() => setForm({ ...form, estaciones: form.estaciones.filter((_, itemIndex) => itemIndex !== index) })}>Quitar</button>}</div>)}</div></section>

      <section className="grid gap-5 rounded-2xl bg-slate-50 p-5 md:grid-cols-2"><div className="md:col-span-2"><p className="text-lg font-semibold text-slate-800">5. Contacto y destinatario del informe</p></div><Input label="Nombre completo del contacto *" value={form.contacto.nombreCompleto} onChange={(event) => setForm({ ...form, contacto: { ...form.contacto, nombreCompleto: event.target.value } })} /><Input label="Cargo" value={form.contacto.cargo} onChange={(event) => setForm({ ...form, contacto: { ...form.contacto, cargo: event.target.value } })} /><Input label="Teléfono *" inputMode="tel" value={form.contacto.telefono} onChange={(event) => setForm({ ...form, contacto: { ...form.contacto, telefono: event.target.value } })} /><Input label="Correo electrónico *" type="email" value={form.contacto.correo} onChange={(event) => setForm({ ...form, contacto: { ...form.contacto, correo: event.target.value } })} /><div className="md:col-span-2"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={sameRecipient} onChange={(event) => { setSameRecipient(event.target.checked); if (event.target.checked) setForm((current) => ({ ...current, destinatarioInforme: { razonSocial: current.cliente, ruc: current.numeroDocumento } })); }} />Usar los mismos datos de la empresa solicitante como destinataria del informe</label></div><Input label="Razón social destinataria del informe" value={form.destinatarioInforme.razonSocial} onChange={(event) => { setSameRecipient(false); setForm({ ...form, destinatarioInforme: { ...form.destinatarioInforme, razonSocial: event.target.value } }); }} /><Input label="RUC destinatario del informe" inputMode="numeric" value={form.destinatarioInforme.ruc} onChange={(event) => { setSameRecipient(false); setForm({ ...form, destinatarioInforme: { ...form.destinatarioInforme, ruc: event.target.value.replace(/\D/g, "") } }); }} /></section>
      <footer className="flex flex-col gap-4 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-xs leading-5 text-slate-500">Al enviar, Ecology registrará tu solicitud para revisarla y elaborar la cotización. Los campos con <strong>*</strong> son obligatorios.</p><button className="rounded-xl bg-[#103f37] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-[#0b302a]">Enviar solicitud</button></footer>
    </form></div></main>;
};

export default FormClientes;
