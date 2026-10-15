import { useEffect } from "react";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";
const unidadesDeMedida = [
    "pH",
    "mg/L",
    "µg/L",
    "ng/L",
    "ppm",
    "ppb",
    "mg/kg",
    "µg/kg",
    "g/L",
    "mol/L",
    "%",
    "µS/cm",
    "mS/cm",
    "NTU",
    "mg O₂/L",
    "mg/m³",
    "µg/m³",
    "UFC/mL",
    "UFC/g",
    "NMP/100 mL",
    "°C"
];
const tiposDeItem = ["INDIVIDUAL", "PAQUETE", "CAMPO"];
const unidadesDeCobro = ["POR_UNIDAD", "POR_PUNTO", "POR_MUESTRA", "POR_DIA", "POR_CAMPANA", "POR_EQUIPO"];

const DatosDelParametro = ({ form, setForm }) => {
    useEffect(() => {
        if (form.tipoDeAnalisis !== "AGUA" && form.tipoDeAnalisis !== "SUELO" && form.tipoDeAnalisis !== "EMISIONES") {
            setForm((prev) => ({ ...prev, tipoDeAcreditacion: "" }));
        }
    }, [form.tipoDeAnalisis]);
    return (
        <div className="flex flex-wrap ">
            <InputP
                label="Tipo de Analisis"
                name="tipoDeAnalisis"
                type="select"
                editable={false}
                options={["AGUA", "AIRE", "SUELO", "RUIDO", "EMISIONES", "MONITOREO OCUPACIONAL"
                ]}
                value={form.tipoDeAnalisis || ""}
                setForm={setForm}
            />
            {
                form.tipoDeAnalisis === "AGUA" &&
                <InputP
                    label="Categoria"
                    name="categoria"
                    type="select"
                    options={[
                        "AGUA PARA USO Y CONSUMO HUMANO",
                        "AGUA RESIDUAL",
                        "AGUA NATURAL",
                        "AGUA SALINA",
                    ]}
                    value={form.categoria}
                    setForm={setForm}
                />
            }
            <InputP
                label="Nombre corto para cotizar"
                name="nombreCorto"
                value={form.nombreCorto || ""}
                setForm={setForm}
            />
            <InputP
                label="Tipo de ítem"
                name="tipoItem"
                type="select"
                editable={false}
                options={tiposDeItem}
                value={form.tipoItem || "INDIVIDUAL"}
                setForm={setForm}
            />
            <InputP
                label="Unidad de cobro"
                name="unidadCobro"
                type="select"
                editable={false}
                options={unidadesDeCobro}
                value={form.unidadCobro || "POR_UNIDAD"}
                setForm={setForm}
            />
            <InputP
                label="Alcance técnico / parámetro"
                name="parametro"
                value={form.parametro}
                setForm={setForm}
            />
            <div className="flex flex-col mx-3 F h-20">
                <label className="text-base font-medium text-gray-700">Componentes incluidos</label>
                <input
                    className="mt-1 px-3 py-2 border-gray-300 bg-white border min-w-56 text-base! rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ej.: PM10, PM2.5, SO2"
                    value={Array.isArray(form.componentes) ? form.componentes.join(", ") : form.componentes || ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, componentes: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))}
                />
                <span className="mt-1 text-xs text-gray-500">Sepáralos por comas. No modifica el precio individual del ensayo.</span>
            </div>
            <InputP
                label="Método"
                name="metodo"
                ancho="w-96"
                value={form.metodo}
                setForm={setForm}
            />
            <InputP
                label="Acreditado Por"
                name="acreditadoPor"
                ancho="w-96"
                type="select"
                options={["INACAL", "IAS", "-"]}
                value={form.acreditadoPor}
                setForm={setForm}
            />
            {(form.tipoDeAnalisis === "AGUA" || form.tipoDeAnalisis === "SUELO" || form.tipoDeAnalisis === "EMISIONES") &&

                <InputP
                    type="select"
                    label="Tipo de Acreditación"
                    name="tipoDeAcreditacion"
                    options={["AC", "SUB AC", "SUB", "-"]}
                    value={form.tipoDeAcreditacion}
                    setForm={setForm}
                />
            }
            <InputNormal
                label="L.C.M."
                name="limiteDeCuantificacionDelMetodo"
                onKeyPress={(e) => {
                    if (!/[0-9.-]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                placeholder="Límite de Cuantificación del Método"
                value={form.limiteDeCuantificacionDelMetodo}
                setForm={setForm}
            />
            <InputNormal
                label="L.D.M."
                name="limiteDeDeteccionDelMetodo"
                placeholder="Límite de Detección del Método"
                onKeyPress={(e) => {
                    if (!/[0-9.-]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={form.limiteDeDeteccionDelMetodo}
                setForm={setForm}
            />
            <InputP
                label="Unidad de Medida"
                name="unidadDeMedida"
                type="select"
                mayus={false}
                options={unidadesDeMedida}
                value={form.unidadDeMedida}
                setForm={setForm}
            />
            <InputNormal
                label="Precio Soles"
                name="precio"
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
            {form._id && <InputP label="Estado" name="estado" type="select" editable={false} options={["ACTIVO", "INACTIVO"]} value={form.estado || "ACTIVO"} setForm={setForm} />}
        </div>
    )
}

export default DatosDelParametro;
