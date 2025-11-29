import InputP from "../../../../components/Ui/Input/InputP";

const ProyectosRegister = ({ form, setForm }) => {
    return (
        <div className="flex flex-wrap">
            <InputP
                label="Cliente"
                name="cliente"
                type="select"
                options={["EMPRESA A", "EMPRESA B", "EMPRESA C"]}
                value={form.cliente}
                setForm={setForm}
                ancho="bg-white w-96!"
            />
            <InputP
                label="Servicio"
                name="servicio"
                type="select"
                options={["ANALISIS", "MONITOREO AMBIENTAL"]}
                value={form.servicio}
                setForm={setForm}
                ancho="bg-white w-96!"
            />
            <InputP
                label="Proyecto"
                name="proyecto"
                value={form.proyecto}
                setForm={setForm}
                ancho="bg-white w-96!"
            />
            <InputP
                label="Cantidad de Puntos / Parámetros"
                name="cantidadPuntosParametros"
                value={form.cantidadPuntosParametros}
                setForm={setForm}
                ancho="bg-white w-96!"
            />
            <InputP
                label="Lugar de Muestreo"
                name="lugarMuestreo"
                value={form.lugarMuestreo}
                setForm={setForm}
                ancho="bg-white w-96! "
            />
            <InputP
                label="Fecha de Servicio"
                name="fechaServicio"
                type="date"
                value={form.fechaServicio}
                setForm={setForm}
                ancho="bg-white w-96! "
            />
            <InputP
                label="Dirección Legal"
                name="direccionLegal"
                value={form.direccionLegal}
                setForm={setForm}
                ancho="bg-white w-96! "
            />
        </div>
    )
}

export default ProyectosRegister;