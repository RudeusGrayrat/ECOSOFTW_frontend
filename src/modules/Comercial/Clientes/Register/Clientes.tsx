import InputP from "../../../../components/Ui/Input/InputP";

const ClientesRegister = ({ form, setForm }) => {
    return (
        <div className="px-5 ">
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

            {form.tipoCliente === "EMPRESA" && <InputP
                label="RUC Empresa"
                name="rucEmpresa"
                value={form.rucEmpresa}
                setForm={setForm}
                ancho="bg-white w-80"

            />
            }
            {form.tipoCliente === "EMPRESA" && (<InputP
                label="Razón Social"
                name="razonSocial"
                value={form.razonSocial}
                setForm={setForm}
                ancho="bg-white w-80"

            />)
            }
            {form.tipoCliente === "PERSONA" && <InputP
                label="DNI Cliente"
                name="dniCliente"
                value={form.dniCliente}
                setForm={setForm}
                ancho="bg-white w-80"
            />
            }
            {form.tipoCliente === "PERSONA" && (<InputP
                label="Nombre Cliente"
                name="nombreCliente"
                value={form.nombreCliente}
                setForm={setForm}
                ancho="bg-white w-80"
            />)}
        </div>
    );
}
export default ClientesRegister;