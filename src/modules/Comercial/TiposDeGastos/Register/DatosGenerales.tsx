import InputP from "../../../../components/Ui/Input/InputP";

const DatosGenerales = ({ form, setForm }) => {

    const optionsTiposDeGastos = [
        "GASTOS OPERATIVOS",
        "GASTOS ADMINISTRATIVOS",
        "ALQUILER DE EQUIPOS",
        "COMPRA DE CONSUMIBLES",
        "PERSONAL",
        "UNIFORMES Y EPP BASICOS",
        "OTROS"
    ];
    return (
        <div className="flex flex-wrap">
            <InputP
                label="Categoría en cotización"
                name="categoria"
                type="select"
                ancho={"w-80!"}
                options={["OPERATIVO", "ADMINISTRATIVO"]}
                value={form.categoria}
                setForm={setForm}
            />
            <InputP
                label="Tipo de Gasto"
                name="tipoDeGasto"
                type="select"
                ancho={"w-80!"}
                options={optionsTiposDeGastos}
                value={form.tipoDeGasto}
                setForm={setForm}
            />
            <InputP
                label="Código técnico"
                name="codigo"
                type="text"
                ancho={"w-80!"}
                placeholder="Ejm.: COMBUSTIBLE"
                value={form.codigo || ""}
                setForm={setForm}
            />
            <InputP
                label="Origen"
                name="origen"
                type="select"
                editable={false}
                options={["MANUAL", "CALCULADORA_LOGISTICA"]}
                value={form.origen || "MANUAL"}
                setForm={setForm}
            />
            <InputP
                label="Unidad de referencia"
                name="unidadReferencia"
                type="select"
                editable={false}
                options={["FIJO", "POR_UNIDAD", "POR_DIA", "POR_PERSONA_DIA", "POR_KM", "POR_GALON"]}
                value={form.unidadReferencia || "FIJO"}
                setForm={setForm}
            />
            <InputP
                label="Descripción"
                name="descripcion"
                type="text"
                ancho={"w-96!"}
                value={form.descripcion}
                setForm={setForm}
            />
            <InputP
                label="Precio Soles"
                name="precio"
                type="number"
                onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={form.precio}
                setForm={setForm}
            />
            <InputP
                label="Vigente desde"
                name="vigenciaDesde"
                type="date"
                mayus={false}
                value={form.vigenciaDesde ? String(form.vigenciaDesde).slice(0, 10) : ""}
                setForm={setForm}
            />
            <InputP
                label="Vigente hasta (opcional)"
                name="vigenciaHasta"
                type="date"
                mayus={false}
                value={form.vigenciaHasta ? String(form.vigenciaHasta).slice(0, 10) : ""}
                setForm={setForm}
            />
        </div>
    )
}

export default DatosGenerales;
