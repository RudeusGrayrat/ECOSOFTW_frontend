import { useEffect, useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Proyecto = ({ form, setForm }) => {
    const [localForm, setLocalForm] = useState({
        _id: "",
        nombre: "",
        cliente: "",
        servicio: "",
        fechaServicio: "",
        cantidadDeMuestreo: 0,
        lugarMuestreo: "",
    });
    const [tiempoDeEntrega, setTiempoDeEntrega] = useState([]);
    const [clienteForAutoComplete, setClienteForAutoComplete] = useState([]);
    console.log("localForm", localForm);
    const [proyectosForAutoComplete, setProyectosForAutoComplete] = useState([]);
    console.log("proyectosForAutoComplete", proyectosForAutoComplete);
    useEffect(() => {
        if (localForm.nombre && localForm.cliente) {
            const proyectoSeleccionado = localForm.nombre
            setLocalForm({
                ...localForm,
                servicio: proyectoSeleccionado.servicio,
                fechaServicio: dayjs(proyectoSeleccionado.fechaServicio, "DD/MM/YYYY").format("YYYY-MM-DD"),
                cantidadDeMuestreo: Number(proyectoSeleccionado.cantidadPuntosParametros),
                lugarMuestreo: proyectoSeleccionado.lugarMuestreo,
                _id: proyectoSeleccionado._id
            });
        }

    }, [localForm.nombre]);
    useEffect(() => {
        if (localForm.cliente) {
            setLocalForm(prev => ({
                ...prev,
                nombre: "",
                servicio: "",
                fechaServicio: "",
                cantidadDeMuestreo: 0,
                lugarMuestreo: "",
                tipoDeServicio: "",
                _id: ""
            }));
        }
    }, [localForm.cliente]);
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
                label="Cantidad de Muestreo"
                name="cantidadDeMuestreo"
                type="number"
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