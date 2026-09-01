import InputP from "../../../../components/Ui/Input/InputP";

const DatosGenerales = ({ form, setForm, editing = false }) => {
    return (
        <div className="flex flex-wrap">
            <InputP label="Usuario" name="userName" type="text" ancho="w-80!" value={form.userName} setForm={setForm} />
            <InputP label="Colaborador" name="colaborador" type="text" ancho="w-96!" value={form.colaborador} setForm={setForm} />
            <InputP label="Correo Electrónico" name="correoElectronico" type="text" ancho="w-96!" value={form.correoElectronico} setForm={setForm} />
            <InputP label="Puesto" name="puesto" type="text" ancho="w-80!" value={form.puesto} setForm={setForm} />
            <InputP label="Teléfono" name="telefono" type="text" ancho="w-72!" value={form.telefono} setForm={setForm} />
            <InputP label={editing ? "Nueva Contraseña" : "Contraseña"} name="password" type="password" ancho="w-80!" value={form.password} setForm={setForm} />
        </div>
    )
}

export default DatosGenerales;
