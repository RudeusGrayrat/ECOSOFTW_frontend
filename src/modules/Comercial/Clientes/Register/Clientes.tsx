import InputP from "../../../../components/Ui/Input/InputP";

const ClientesRegister = ({ form, setForm }) => {
    return (
        <div className="px-5 flex flex-wrap ">
            <InputP
                label="Tipo de Cliente"
                name="tipoCliente"
                type="select"
                options={["EMPRESA", "PERSONA"]}
                value={form.tipoCliente}
                ancho="bg-white w-80"
                setForm={setForm}
                errorOnclick={true}
            />

            <InputP
                label={form.tipoCliente === "PERSONA" ? "DNI" : "RUC"}
                name="numeroDocumento"
                value={form.numeroDocumento}
                setForm={setForm}
                ancho="bg-white "
            />
            <InputP
                label={form.tipoCliente === "PERSONA" ? "NOMBRE COMPLETO" : "RAZÓN SOCIAL"}
                name="cliente"
                value={form.cliente}
                setForm={setForm}
                ancho="bg-white w-96!"
            />

            <InputP
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                setForm={setForm}
                ancho="bg-white w-"
            />
            <InputP
                label="Correo Electrónico"
                name="correoElectronico"
                placeholder="Ejemplo: correo@ejemplo.com"
                value={form.correoElectronico}
                setForm={setForm}
                ancho="bg-white w-96!"
            />
            <InputP
                label="Dirección Legal"
                name="direccionLegal"
                value={form.direccionLegal}
                setForm={setForm}
                ancho="bg-white w-96! "
            />
            {
                form.tipoCliente === "EMPRESA" && (
                    <InputP
                        label="Nombre del Contacto"
                        name="nombreContacto"
                        value={form.nombreContacto}
                        setForm={setForm}
                        ancho="bg-white w-96! "
                    />
                )
            }
        </div>
    );
}
export default ClientesRegister;