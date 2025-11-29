import { useState } from "react";
import ButtonOk from "../../../components/Ui/Button/Buttons";
import InputP from "../../../components/Ui/Input/InputP";
import { Steps } from "primereact/steps";


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
    const [activeIndex, setActiveIndex] = useState(0);

    const itemRenderer = (item, itemIndex) => {
        const isActiveItem = activeIndex === itemIndex;
        const backgroundColor = isActiveItem ? 'var(--primary-color)' : 'var(--surface-b)';
        const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

        return (
            <span
                className="inline-flex align-items-center text-center! justify-center items-center rounded-full border-circle! border-primary border-1 h-16! w-16! z-1 cursor-pointer"
                style={{ backgroundColor: backgroundColor, color: textColor, marginTop: '-25px' }}
                onClick={() => setActiveIndex(itemIndex)}
            >
                <i className={`${item.icon} text-2xl!`} />
            </span>
        );
    };
    const items = [
        {
            icon: 'pi pi-user',
            template: (item) => itemRenderer(item, 0)
        },
        {
            icon: 'pi pi-calendar',
            template: (item) => itemRenderer(item, 1)
        },
        {
            icon: 'pi pi-check',
            template: (item) => itemRenderer(item, 2)
        }
    ];

    return (
        <div className=" h-screen w-full max-h-screen min-h-screen grid-cols-6 grid items-center justify-center"
            style={{
                backgroundImage: "url('/BGFORM.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="col-start-2  p-7!   max-md:col-start-1 max-md:mx-5 h-[90%] max-md:col-end-7 max-md:w-[94%] col-end-6  shadow-2xl max-md:max-h-[90%] w-full max-h-[90%] rounded-4xl overflow-x-hidden grid grid-rows-8 justify-items-center items-center" style={{
                backgroundColor: "rgba(217, 217, 217, 0.90)",
                padding: "calc(var(--spacing) * 7) /* 1.75rem = 28px */ !important;"
            }}
            >

                <h2 className="text-4xl  ">
                    Formulario de Cotización
                </h2>
                <div className="w-full ">
                    <Steps model={items} activeIndex={activeIndex} readOnly={false} className=" w-full m-2 pt-4" />
                </div>
                <h2 className="w-full  pl-[15%] text-cyan-500 text-2xl font-semibold">
                    {activeIndex === 0 && "Datos del Cliente"}
                    {activeIndex === 1 && "Detalles del Servicio"}
                    {activeIndex === 2 && "Confirmar Datos"}
                </h2>
                <div className=" row-start-4 row-end-8 max-md:flex max-md:flex-wrap  max-md:max-h-full max-md:p-0 h-full  m-10 p-7 max-lg:justify-center w-[90%] flex flex-wrap items-center justify-center! max-sm:m-0 overflow-y-auto ">
                    {
                        activeIndex === 0 && (
                            <div className="w-full h-full flex flex-wrap  gap-x-12 justify-center">

                                <InputP
                                    label="Tipo de Cliente"
                                    name="tipoCliente"
                                    type="select"
                                    options={["EMPRESA", "PERSONA"]}
                                    value={form.tipoCliente}
                                    ancho="bg-white w-96!    "
                                    setForm={setForm}
                                    errorOnclick={true}
                                />

                                {form.tipoCliente === "EMPRESA" && <InputP
                                    label="RUC Empresa"
                                    name="rucEmpresa"
                                    value={form.rucEmpresa}
                                    setForm={setForm}
                                    ancho="bg-white w-96!    "

                                />
                                }
                                {form.tipoCliente === "EMPRESA" && (<InputP
                                    label="Razón Social"
                                    name="razonSocial"
                                    value={form.razonSocial}
                                    setForm={setForm}
                                    ancho="bg-white w-96!"

                                />)
                                }
                                {form.tipoCliente === "PERSONA" && <InputP
                                    label="DNI Cliente"
                                    name="dniCliente"
                                    value={form.dniCliente}
                                    setForm={setForm}
                                    ancho="bg-white w-96!"
                                />
                                }
                                {form.tipoCliente === "PERSONA" && (<InputP
                                    label="Nombre Cliente"
                                    name="nombreCliente"
                                    value={form.nombreCliente}
                                    setForm={setForm}
                                    ancho="bg-white w-96!"
                                />)
                                }
                                <InputP
                                    label="Teléfono"
                                    name="telefono"
                                    value={form.telefono}
                                    setForm={setForm}
                                    ancho="bg-white w-96!"
                                />
                                <InputP
                                    label="Correo"
                                    name="correo"
                                    mayus={false}
                                    value={form.correo}
                                    setForm={setForm}
                                    ancho="bg-white w-96!"
                                />
                            </div>
                        )
                    }
                    {activeIndex === 1 && (<div className="w-full h-full  gap-x-12  flex flex-wrap justify-center">
                        <InputP
                            label="Servicio"
                            name="servicio"
                            type="select"
                            options={["ANALISIS", "MONITOREO AMBIENTAL"]}
                            value={form.servicio}
                            setForm={setForm}
                            ancho="bg-white w-96!"
                        />
                        <InputP
                            label="Proyecto"
                            name="proyecto"
                            value={form.proyecto}
                            setForm={setForm}
                            ancho="bg-white w-96!"
                        />
                        <InputP
                            label="Cantidad de Puntos / Parámetros"
                            name="cantidadPuntosParametros"
                            value={form.cantidadPuntosParametros}
                            setForm={setForm}
                            ancho="bg-white w-96!"
                        />
                        <InputP
                            label="Lugar de Muestreo"
                            name="lugarMuestreo"
                            value={form.lugarMuestreo}
                            setForm={setForm}
                            ancho="bg-white w-96! "
                        />
                        <InputP
                            label="Fecha de Servicio"
                            name="fechaServicio"
                            type="date"
                            value={form.fechaServicio}
                            setForm={setForm}
                            ancho="bg-white w-96! "
                        />
                        <InputP
                            label="Dirección Legal"
                            name="direccionLegal"
                            value={form.direccionLegal}
                            setForm={setForm}
                            ancho="bg-white w-96! "
                        />
                    </div>)
                    }


                </div>
                {activeIndex < 2 && <ButtonOk classe="w-90 max-sm:w-64 !p-3 !rounded-2xl font-medium text-lg" type="ok" onClick={() => console.log("OK clicked")}>
                    Siguiente
                </ButtonOk>}
                {
                    activeIndex === 2 &&
                    <ButtonOk classe="w-90 max-sm:w-64 !p-3 !rounded-2xl font-medium text-lg" type="ok" onClick={() => console.log("OK clicked")}>
                        Confirmar
                    </ButtonOk>
                }

            </div>
        </div >);
};

export default FormClientes;