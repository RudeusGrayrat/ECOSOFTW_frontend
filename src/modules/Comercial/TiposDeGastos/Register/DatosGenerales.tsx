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
                label="Tipo de Gasto"
                name="tipoDeGasto"
                type="select"
                ancho={"w-80!"}
                options={optionsTiposDeGastos}
                value={form.tipoDeGasto}
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
        </div>
    )
}

export default DatosGenerales;