import { useEffect, useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";

const Proyecto = ({ form, setForm }) => {
    const [localForm, setLocalForm] = useState({
        _id: "",
        proyecto: "",
        cliente: "",
        servicio: "",
        fechaServicio: "",
        cantidadDeMuestreo: 0,
        lugarMuestreo: "",
    });
    const [tiempoDeEntrega, setTiempoDeEntrega] = useState([]);
    const proyectos = [
        {
            id: "1", nombre: "PROYECTO 1", cliente: "CLIENTE 1", servicio: "SERVICIO A",
            fechaServicio: "2024-07-01", cantidadDeMuestreo: 10, lugarMuestreo: "LUGAR X"
        },
        {
            id: "2", nombre: "PROYECTO 2", cliente: "CLIENTE 2",
            servicio: "SERVICIO B", fechaServicio: "2024-07-05",
            cantidadDeMuestreo: 20, lugarMuestreo: "LUGAR Y"
        },
        {
            id: "3", nombre: "PROYECTO 3", cliente: "CLIENTE 1", servicio: "SERVICIO C",
            fechaServicio: "2024-07-10", cantidadDeMuestreo: 15, lugarMuestreo: "LUGAR Z"
        },
        {
            id: "4", nombre: "PROYECTO 4", cliente: "CLIENTE 3",
            servicio: "SERVICIO D", fechaServicio: "2024-07-15",
            cantidadDeMuestreo: 25, lugarMuestreo: "LUGAR W"
        },
        {
            id: "5", nombre: "PROYECTO 5", cliente: "CLIENTE 2",
            servicio: "SERVICIO E", fechaServicio: "2024-07-20",
            cantidadDeMuestreo: 30, lugarMuestreo: "LUGAR V"
        },
        {
            id: "6", nombre: "PROYECTO 6", cliente: "CLIENTE 3",
            servicio: "SERVICIO F", fechaServicio: "2024-07-25",
            cantidadDeMuestreo: 12, lugarMuestreo: "LUGAR U"
        },
        {
            id: "7", nombre: "PROYECTO 7", cliente: "CLIENTE 1",
            servicio: "SERVICIO G", fechaServicio: "2024-07-30",
            cantidadDeMuestreo: 18, lugarMuestreo: "LUGAR T"
        }
    ]
    const proyectosPorCliente = proyectos.filter((p) => p.cliente === localForm.cliente);
    const proyectosNombres = proyectosPorCliente.map((p) => p.nombre);
    useEffect(() => {
        const proyectoSeleccionado = proyectos.find((p) => p.nombre === localForm.proyecto);
        if (localForm.proyecto && proyectoSeleccionado) {
            setLocalForm({
                ...localForm,
                proyecto: proyectoSeleccionado.nombre,
                servicio: proyectoSeleccionado.servicio,
                fechaServicio: proyectoSeleccionado.fechaServicio,
                cantidadDeMuestreo: proyectoSeleccionado.cantidadDeMuestreo,
                lugarMuestreo: proyectoSeleccionado.lugarMuestreo,
                _id: proyectoSeleccionado.id
            });
        }

    }, [localForm.proyecto]);
    useEffect(() => {
        if (localForm.cliente) {
            setLocalForm(prev => ({
                ...prev,
                proyecto: "",
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
        if (localForm.cliente && localForm.proyecto
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
        localForm.proyecto,
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
                type="select"
                options={["CLIENTE 1", "CLIENTE 2", "CLIENTE 3"]}
                value={localForm.cliente}
                setForm={setLocalForm}
            />
            <InputP
                label="Proyecto"
                name="proyecto"
                ancho="w-96"
                type="select"
                editable={localForm.cliente !== ""}
                options={proyectosNombres}
                value={localForm.proyecto}
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