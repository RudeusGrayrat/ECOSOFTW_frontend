import { useState } from "react";
import ButtonOk from "../../../components/Ui/Button/Buttons";
import InputP from "../../../components/Ui/Input/InputP";

const FormClientes = () => {
    const [form, setForm] = useState({
        tipoCliente: "EMPRESA",
        rucEmpresa: "",
        razonSocial: "",
        dniCliente: "",
        nombreCliente: "",

        telefono: "",
        correo: "",
        servicio: "",
        proyecto: "",
        cantidadPuntosParametros: "",
        lugarMuestreo: "",
        fechaServicio: "",
        direccionLegal: "",

    });
    return (
        <div className=" h-screen w-full max-h-screen min-h-screen grid-cols-6 grid items-center justify-center"
            style={{
                backgroundImage: "url('/BGFORM.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="col-start-2 max-md:col-start-1 max-md:mx-5 h-[90%] max-md:col-end-7 max-md:w-[94%] col-end-6  p-3 shadow-2xl max-md:max-h-[90%] w-full max-h-[90%] rounded-4xl flex flex-col items-center overflow-x-hidden justify-center" style={{
                backgroundColor: "rgba(217, 217, 217, 0.67)"
            }}>
                <p className="text-center text-6xl max-sm:text-5xl max-sm:m-4  font-bold text-green-900">REGISTRO CLIENTE</p>
                <div className="max-md:flex max-md:flex-wrap  max-md:max-h-full max-md:p-0 max-h-[60%] m-10 p-7 max-lg:justify-center  w-[90%] flex flex-wrap gap-6 justify-start max-sm:justify-center max-sm:m-0 overflow-y-auto">
                    <InputP
                        label="Tipo de Cliente"
                        name="tipoCliente"
                        type="select"
                        options={["EMPRESA", "PERSONA"]}
                        value={form.tipoCliente}
                        setForm={setForm}
                        ancho="!py-0"
                        errorOnclick={true}
                    />

                    {form.tipoCliente === "EMPRESA" && <InputP
                        label="RUC Empresa"
                        name="rucEmpresa"
                        value={form.rucEmpresa}
                        setForm={setForm}
                        ancho="bg-white "

                    />
                    }
                    {form.tipoCliente === "EMPRESA" && (<InputP
                        label="Razón Social"
                        name="razonSocial"
                        value={form.razonSocial}
                        setForm={setForm}
                        ancho="bg-white w-90"

                    />)
                    }
                    {form.tipoCliente === "PERSONA" && <InputP
                        label="DNI Cliente"
                        name="dniCliente"
                        value={form.dniCliente}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    }
                    {form.tipoCliente === "PERSONA" && (<InputP
                        label="Nombre Cliente"
                        name="nombreCliente"
                        value={form.nombreCliente}
                        setForm={setForm}
                        ancho="bg-white w-90"
                    />)
                    }
                    <InputP
                        label="Teléfono"
                        name="telefono"
                        value={form.telefono}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    <InputP
                        label="Correo"
                        name="correo"
                        value={form.correo}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    <InputP
                        label="Servicio"
                        name="servicio"
                        value={form.servicio}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    <InputP
                        label="Proyecto"
                        name="proyecto"
                        value={form.proyecto}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    <InputP
                        label="Cantidad de Puntos/Parámetros"
                        name="cantidadPuntosParametros"
                        value={form.cantidadPuntosParametros}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    <InputP
                        label="Lugar de Muestreo"
                        name="lugarMuestreo"
                        value={form.lugarMuestreo}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    <InputP
                        label="Fecha de Servicio"
                        name="fechaServicio"
                        value={form.fechaServicio}
                        setForm={setForm}
                        ancho="bg-white "
                    />
                    <InputP
                        label="Dirección Legal"
                        name="direccionLegal"
                        value={form.direccionLegal}
                        setForm={setForm}
                        ancho="bg-white "
                    />


                </div>
                <ButtonOk classe="w-90 max-sm:w-64 !p-3 !rounded-2xl font-medium text-lg" type="ok" onClick={() => console.log("OK clicked")}>
                    Confirmar
                </ButtonOk>

            </div>
        </div>);
};

export default FormClientes;