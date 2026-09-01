import InputP from "../../../../components/Ui/Input/InputP";

const DatosGenerales = ({ form, setForm, disabledName = false }) => {
    return (
        <div className="flex flex-wrap">
            <InputP
                label="Permiso"
                name="name"
                type="text"
                ancho={"w-80!"}
                value={form.name}
                setForm={setForm}
                disabled={disabledName}
            />
            <InputP
                label="Descripción"
                name="description"
                type="text"
                ancho={"w-96!"}
                value={form.description}
                setForm={setForm}
            />
        </div>
    )
}

export default DatosGenerales;
