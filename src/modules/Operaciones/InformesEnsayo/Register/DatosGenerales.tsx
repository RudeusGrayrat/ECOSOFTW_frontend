import InputP from "../../../../components/Ui/Input/InputP";

const DatosGenerales = ({ form, setForm, setFile }) => {
    return (
        <div className="flex flex-wrap">
            <InputP
                label="Código del Informe"
                name="codigo"
                type="text"
                ancho="w-80!"
                value={form.codigo}
                setForm={setForm}
                title="Opcional. Si lo dejas vacío se detecta desde el nombre del PDF."
            />
            <InputP
                label="Motivo"
                name="motivo"
                type="text"
                ancho="w-96!"
                value={form.motivo}
                setForm={setForm}
            />
            <InputP
                label="Marca de Agua"
                name="tipoPlantilla"
                type="select"
                ancho="w-80!"
                options={["INACAL", "NAC", "SIN_ACREDITACION"]}
                value={form.tipoPlantilla}
                setForm={setForm}
            />
            <div className="flex flex-col mx-3 F h-20">
                <label className="text-base font-medium text-gray-700">PDF del Informe</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    className="mt-1 px-3 py-2 border min-w-56 text-base! rounded-md! shadow-sm sm:text-sm focus:outline-none! focus:ring-emerald-500! focus:border-emerald-500! bg-white border-gray-300!"
                />
            </div>
        </div>
    )
}

export default DatosGenerales;
