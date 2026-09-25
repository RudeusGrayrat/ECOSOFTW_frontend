import { useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";

const ProyectosRegister = ({ form, setForm }) => {
    const [clientesForAutoComplete, setClientesForAutoComplete] = useState([]);
    return (
        <div className="flex flex-wrap">
            <InputP
                label="Cliente"
                name="cliente"
                type="autocomplete"
                otro={false}
                ancho={"w-96!"}
                setOptions={setClientesForAutoComplete}
                options={clientesForAutoComplete}
                fetchData={"/comercial/getClientesPaginacion"}
                setForm={setForm}
                value={form.cliente}
            />
            <InputP
                label="Servicio"
                name="servicio"
                type="select"
                options={["ANALISIS", "MONITOREO AMBIENTAL"]}
                value={form.servicio}
                setForm={setForm}
            />
            <InputP
                label="Proyecto"
                name="proyecto"
                value={form.proyecto}
                setForm={setForm}
                ancho={"w-96!"}
            />
            <InputP
                label="Cantidad de Puntos / Parámetros Solicitados"
                name="cantidadPuntosParametros"
                type="textarea"
                value={form.cantidadPuntosParametros}
                setForm={setForm}
                ancho="w-96!"
                placeholder="Ej.: 3 puntos, PM10, PM2.5 y SO₂"
            />
            <InputP
                label="Lugar de Muestreo"
                name="lugarMuestreo"
                value={form.lugarMuestreo}
                setForm={setForm}
                ancho={"w-96!"}
            />
            <InputP
                type="date"
                label="Fecha de Servicio"
                name="fechaServicio"
                value={form.fechaServicio}
                setForm={setForm}
            />
        </div>
    )
}

export default ProyectosRegister;
