import { useEffect, useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "../../../../api/axios";

dayjs.extend(customParseFormat);

const Proyecto = ({ form, setForm }) => {
    const [localForm, setLocalForm] = useState({
        _id: "",
        nombre: "",
        cliente: "",
        servicio: "",
        fechaServicio: "",
        cantidadDeMuestreo: "",
        lugarMuestreo: "",
    });
    const [tiempoDeEntrega, setTiempoDeEntrega] = useState([]);
    const [clienteForAutoComplete, setClienteForAutoComplete] = useState([]);
    const [proyectosForAutoComplete, setProyectosForAutoComplete] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState("");
    useEffect(() => {
        axios.get("/comercial/solicitudes-cotizacion").then((response) => setSolicitudes(response.data.data || [])).catch(() => setSolicitudes([]));
    }, []);
    const cargarSolicitud = (id) => {
        setSolicitudSeleccionada(id);
        const solicitud = solicitudes.find((item) => item._id === id);
        if (!solicitud) return;
        const cliente = solicitud.cliente_id;
        const proyecto = solicitud.proyecto_id;
        setLocalForm({ _id: proyecto?._id || "", nombre: proyecto || "", cliente: cliente || "", servicio: (solicitud.servicios || []).join(", "), fechaServicio: solicitud.fechaServicio ? dayjs(solicitud.fechaServicio).format("YYYY-MM-DD") : "", cantidadDeMuestreo: solicitud.cantidadPuntosParametros || proyecto?.cantidadPuntosParametros || "", lugarMuestreo: solicitud.lugarEjecucion || "" });
        setForm((prev) => ({ ...prev, solicitud_id: solicitud._id, proyecto_id: proyecto?._id || "", tipoDeServicio: (solicitud.servicios || []).join(", "), facturacion: { razonSocial: cliente?.cliente || "", ruc: cliente?.numeroDocumento || "", direccion: cliente?.direccionLegal || "", formaPago: prev.facturacion?.formaPago || "" } }));
    };
    useEffect(() => {
        // Una solicitud trae su propio detalle. No lo sobrescribimos con el
        // resumen histórico del proyecto (que puede ser anterior o vacío).
        if (!solicitudSeleccionada && localForm.nombre && localForm.cliente) {
            const proyectoSeleccionado = localForm.nombre
            setLocalForm({
                ...localForm,
                servicio: proyectoSeleccionado.servicio,
                fechaServicio: dayjs(proyectoSeleccionado.fechaServicio, "DD/MM/YYYY").format("YYYY-MM-DD"),
                cantidadDeMuestreo: proyectoSeleccionado.cantidadPuntosParametros || "",
                lugarMuestreo: proyectoSeleccionado.lugarMuestreo,
                _id: proyectoSeleccionado._id
            });
        }

    }, [localForm.nombre, solicitudSeleccionada]);
    useEffect(() => {
        if (localForm.cliente && !solicitudSeleccionada) {
            setForm((prev) => ({
                ...prev,
                facturacion: {
                    razonSocial: localForm.cliente.cliente || "",
                    ruc: localForm.cliente.numeroDocumento || "",
                    direccion: localForm.cliente.direccionLegal || "",
                    formaPago: prev.facturacion?.formaPago || "",
                }
            }));
            setLocalForm(prev => ({
                ...prev,
                nombre: "",
                servicio: "",
                fechaServicio: "",
                cantidadDeMuestreo: "",
                lugarMuestreo: "",
                tipoDeServicio: "",
                _id: ""
            }));
        }
    }, [localForm.cliente, solicitudSeleccionada]);
    useEffect(() => {
        if (localForm.cliente && localForm.nombre
            && localForm.servicio
            && localForm.fechaServicio
            && localForm.cantidadDeMuestreo
            && localForm.lugarMuestreo
            && tiempoDeEntrega.length > 0
        ) {
            setForm({
                ...form,
                proyecto_id: localForm._id,
                tiempoDeEntrega: tiempoDeEntrega,
                tipoDeServicio: localForm.servicio
            });
        }
    }, [
        localForm.cliente,
        localForm.nombre,
        localForm.servicio,
        localForm.fechaServicio,
        localForm.cantidadDeMuestreo,
        localForm.lugarMuestreo,
        tiempoDeEntrega
    ]);
    return (
        <div className="flex flex-wrap ">
            <div className="mb-5 w-full rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <label className="mb-2 block text-sm font-semibold text-emerald-900">Solicitud del cliente</label>
                <select className="w-full rounded-lg border border-emerald-200 bg-white p-3" value={solicitudSeleccionada} onChange={(e) => cargarSolicitud(e.target.value)}>
                    <option value="">Seleccionar una solicitud o cotizar manualmente</option>
                    {solicitudes.map((item) => <option key={item._id} value={item._id}>{item.cliente_id?.cliente} — {item.proyecto_id?.nombre} — {new Date(item.createdAt).toLocaleDateString()}</option>)}
                </select>
                {solicitudSeleccionada && (
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm text-emerald-800">
                        Se usará el detalle enviado por el cliente: {localForm.cantidadDeMuestreo || "sin detalle de puntos o parámetros"}.
                    </p>
                )}
            </div>
            <InputP
                label="Cliente"
                name="cliente"
                ancho="w-96"
                type="autocomplete"
                options={clienteForAutoComplete}
                setOptions={setClienteForAutoComplete}
                fetchData={"/comercial/getClientesPaginacion"}
                otro={false}
                value={localForm.cliente}
                setForm={setLocalForm}
            />
            <div className="mt-5 w-full border-t border-slate-200 pt-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-700">Informe y facturación</h3>
                <p className="mb-4 text-sm text-slate-500">Se completa desde el cliente seleccionado. Puedes editarlo para esta cotización sin alterar su ficha.</p>
                <div className="flex flex-wrap gap-4">
                    <InputNormal label="Razón social" name="razonSocial" ancho="w-96" value={form.facturacion?.razonSocial || ""} setForm={(next) => setForm((prev) => ({ ...prev, facturacion: { ...prev.facturacion, razonSocial: typeof next === "function" ? next(prev.facturacion).razonSocial : next.razonSocial } }))} />
                    <InputNormal label="RUC / DNI" name="ruc" ancho="w-60" value={form.facturacion?.ruc || ""} setForm={(next) => setForm((prev) => ({ ...prev, facturacion: { ...prev.facturacion, ruc: typeof next === "function" ? next(prev.facturacion).ruc : next.ruc } }))} />
                    <InputNormal label="Dirección" name="direccion" ancho="w-96" value={form.facturacion?.direccion || ""} setForm={(next) => setForm((prev) => ({ ...prev, facturacion: { ...prev.facturacion, direccion: typeof next === "function" ? next(prev.facturacion).direccion : next.direccion } }))} />
                    <InputNormal label="Forma de pago" name="formaPago" ancho="w-96" value={form.facturacion?.formaPago || ""} setForm={(next) => setForm((prev) => ({ ...prev, facturacion: { ...prev.facturacion, formaPago: typeof next === "function" ? next(prev.facturacion).formaPago : next.formaPago } }))} />
                </div>
            </div>
            <InputP
                label="Proyecto"
                name="nombre"
                ancho="w-96"
                type="autocomplete"
                otro={false}
                setOptions={setProyectosForAutoComplete}
                options={proyectosForAutoComplete}
                fetchData={"/comercial/getProyectosPaginacion"}
                extraParams={{ estado: "ACTIVO", cliente: localForm.cliente?._id }}
                value={localForm.nombre}
                setForm={setLocalForm}
            />
            <InputNormal
                label="Servicio"
                name="servicio"
                ancho="w-96"
                value={localForm.servicio}
                setForm={setLocalForm}
            />
            <InputNormal
                label="Fecha de Servicio"
                name="fechaServicio"
                type="date"
                value={localForm.fechaServicio}
                setForm={setLocalForm}
            />
            <InputNormal
                label="Puntos / Parámetros solicitados"
                name="cantidadDeMuestreo"
                type="text"
                value={localForm.cantidadDeMuestreo}
                setForm={setLocalForm}
            />
            <InputNormal
                label="Lugar de Muestreo"
                name="lugarMuestreo"
                ancho="w-96"
                value={localForm.lugarMuestreo}
                setForm={setLocalForm}
            />
            <InputP
                label="Tiempo de Entrega"
                name="tiempoDeEntrega"
                type="multiSelect"
                options={[
                    "EQUIPOS DE COMPUTO", "TRANSPORTE",
                    "INFORME DE ENSAYO", "PERONAL DE CAMPO",
                    "INFORME DE MONITOREO"]}
                ancho="max-w-[1200px]"
                max={5}
                value={tiempoDeEntrega}
                setForm={setTiempoDeEntrega}
            />
        </div>

    );
}

export default Proyecto;
