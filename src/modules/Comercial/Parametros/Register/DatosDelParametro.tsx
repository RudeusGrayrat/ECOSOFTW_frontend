import { useEffect } from "react";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";

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
                options={["AGUA", "AIRE", "SUELO", "RUIDO", "EMISIONES"]}
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
                label="Parametro"
                name="parametro"
                value={form.parametro}
                setForm={setForm}
            />
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
                options={["unidad de pH", "µS/cm", "mg/L", "µg/L", "NTU", "pH", "°C", "Otros"]}
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
        </div>
    )
}

export default DatosDelParametro;