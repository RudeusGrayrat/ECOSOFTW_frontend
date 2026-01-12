import { useState } from "react";
import ButtonOk from "../../../components/Ui/Button/Buttons";
import InputP from "../../../components/Ui/Input/InputP";
import { Steps } from "primereact/steps";
import { useValidation } from "./validation";
import PopUp from "../../../components/Ui/Messages/PopUp";
import useSendMessage from "../../../components/Ui/Messages/sendMessage";
import axios from "../../../api/axios";
import dayjs from "dayjs";

const FormClientes = () => {
    const [form, setForm] = useState({
        tipoCliente: "EMPRESA",
        cliente: "",
        numeroDocumento: "",
        nombreContacto: "",
        telefono: "",
        correoElectronico: "",
        direccionLegal: "",

        servicio: "",
        proyecto: "",
        cantidadPuntosParametros: "",
        lugarMuestreo: "",
        fechaServicio: "",

    });
    const [activeIndex, setActiveIndex] = useState(0);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
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
    const resetForm = () => {
        setForm({
            tipoCliente: "EMPRESA",
            cliente: "",
            numeroDocumento: "",
            nombreContacto: "",
            telefono: "",
            correoElectronico: "",
            direccionLegal: "",

            servicio: "",
            proyecto: "",
            cantidadPuntosParametros: "",
            lugarMuestreo: "",
            fechaServicio: "",
        });
        setActiveIndex(0);
    };
    const { validateForm } = useValidation()
    const enviar = async () => {
        setDeshabilitar(true);
        try {
            const isValid = validateForm(form);
            if (!isValid) {
                sendMessage("Rellenar los datos necesarios", "Error");
                return;
            }

            const response = await axios.post("/comercial/postFormularioCotizacion", { ...form, fechaServicio: dayjs(form.fechaServicio).format('DD/MM/YYYY') });
            const data = response.data;
            sendMessage(data.message, data.type || "Correcto");
            resetForm();
            return;
        } catch (error) {
            sendMessage(error || error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }

    return (
        <div className=" h-screen w-full max-h-screen min-h-screen grid-cols-6 grid items-center justify-center"
            style={{
                backgroundImage: "url('/BGFORM.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <PopUp deshabilitar={deshabilitar} />
            <div className="col-start-2 max-sm:mx-3  p-7!   max-md:col-start-1 max-md:mx-5 h-[90%] max-md:col-end-7 max-md:w-[94%] col-end-6  shadow-2xl max-md:max-h-[90%] w-full max-h-[90%] rounded-4xl overflow-x-hidden grid grid-rows-8 justify-items-center items-center" style={{
                backgroundColor: "rgba(245, 245, 245, 0.95)",
                padding: "calc(var(--spacing) * 7) /* 1.75rem = 28px */ !important;"
            }}
            >

                <h2 className="text-4xl  ">
                    Formulario de Cotización
                </h2>
                <div className="w-full ">
                    <Steps model={items} activeIndex={activeIndex} readOnly={false} className=" w-full m-2 pt-4" />
                </div>
                <h2 className="w-full  pl-[12%] text-grey-900 text-2xl font-semibold">
                    {activeIndex === 0 && "Datos del Cliente"}
                    {activeIndex === 1 && "Detalles del Servicio"}
                    {activeIndex === 2 && "Confirmar Datos"}
                </h2>
                <div className=" row-start-4 row-end-8 max-md:flex max-md:flex-wrap  max-md:max-h-full max-md:p-0 h-full  mb-10 p-7 max-lg:justify-center w-[98%] flex flex-wrap items-center justify-center content-center max-sm:m-0 overflow-y-auto ">
                    {
                        activeIndex === 0 && (
                            <div className="w-full max-sm:p-[0%] h-full flex flex-wrap items-center gap-x-5 justify-start pl-[10%]">
                                <InputP
                                    label="Tipo de Cliente"
                                    name="tipoCliente"
                                    type="select"
                                    options={["EMPRESA", "PERSONA"]}
                                    value={form.tipoCliente}
                                    ancho="w-96! max-sm:w-64! max-lg:w-80!"
                                    setForm={setForm}
                                    errorOnclick={true}
                                />
                                <InputP
                                    label={form.tipoCliente === "PERSONA" ? "DNI" : "RUC"}
                                    name="numeroDocumento"
                                    placeholder={form.tipoCliente === "PERSONA" ? "Ejemplo: 87654321" : "Ejemplo: 20379251103"}
                                    value={form.numeroDocumento}
                                    setForm={setForm}
                                />
                                <InputP
                                    label={form.tipoCliente === "PERSONA" ? "NOMBRE COMPLETO" : "RAZÓN SOCIAL"}
                                    name="cliente"
                                    placeholder={form.tipoCliente === "PERSONA" ? "Nombre y Apellido" : "Ejemplo: Empresa SAC"}
                                    value={form.cliente}
                                    setForm={setForm}
                                />
                                <InputP
                                    label="Teléfono"
                                    name="telefono"
                                    placeholder={
                                        form.tipoCliente === "PERSONA"
                                            ? "Ejemplo: 987654321"
                                            : "Ejemplo: 01-2345678"
                                    }
                                    value={form.telefono}
                                    setForm={setForm}
                                />
                                <InputP
                                    label="Correo Electrónico"
                                    name="correoElectronico"
                                    placeholder="Ejemplo: correo@ejemplo.com"
                                    value={form.correoElectronico}
                                    setForm={setForm}
                                />
                                <InputP
                                    label="Dirección Legal"
                                    name="direccionLegal"
                                    placeholder="Ejemplo: Av. Siempre Viva 123"
                                    value={form.direccionLegal}
                                    setForm={setForm}
                                    ancho="w-96! max-sm:w-64! max-lg:w-80!"
                                />
                                {
                                    form.tipoCliente === "EMPRESA" && (
                                        <InputP
                                            label="Nombre del Contacto"
                                            name="nombreContacto"
                                            value={form.nombreContacto}
                                            setForm={setForm}
                                            ancho="w-96! max-sm:w-64! max-lg:w-80!"
                                        />
                                    )
                                }
                            </div>
                        )
                    }
                    {activeIndex === 1 && (<div className="max-sm:p-[0%] w-full flex h-[70%] flex-wrap items-start gap-x-5 justify-start pl-[10%]">
                        <InputP
                            label="Servicio"
                            name="servicio"
                            type="select"
                            options={["ANALISIS", "MONITOREO AMBIENTAL"]}
                            value={form.servicio}
                            setForm={setForm}
                        />
                        <InputP
                            label="Proyecto"
                            name="proyecto"
                            placeholder="Ejemplo: Monitoreo de Calidad de Agua"
                            value={form.proyecto}
                            ancho="w-96! max-sm:w-64! max-lg:w-80!"
                            setForm={setForm}

                        />
                        <InputP
                            label="Cantidad de Puntos / Parámetros"
                            name="cantidadPuntosParametros"
                            placeholder="Ejemplo: 10"
                            type="number"
                            value={form.cantidadPuntosParametros}
                            setForm={setForm}

                        />
                        <InputP
                            label="Lugar de Muestreo"
                            name="lugarMuestreo"
                            placeholder="Ejemplo: San Isidro, Lima"
                            value={form.lugarMuestreo}
                            setForm={setForm}
                            ancho="w-96! max-sm:w-64! max-lg:w-80!"
                        />
                        <InputP
                            type="date"
                            label="Fecha de Servicio"
                            name="fechaServicio"
                            value={form.fechaServicio}
                            setForm={setForm}
                            ancho="w-60! "
                        />

                    </div>)
                    }
                    {activeIndex === 2 &&
                        <div className="  w-full h-full flex flex-col gap-6 items-center justify-start pt-2 overflow-x-hidden  border-gray-300  max-sm:p-[0%] max-lg:pl-[8%] pl-[6%] rounded-lg  max-h-[70vh] overflow-y-auto ">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[80%] max-w-full">
                                {Object.entries(form).map(([key, value]) => (
                                    <div key={key} className="flex gap-2 text-left">
                                        <span className="font-medium text-blue-900 capitalize lg:whitespace-nowrap">
                                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                                        </span>
                                        {value ? <span className="break-words">
                                            {value}
                                        </span> : <span className="text-red-500 italic">No proporcionado</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    }

                </div>
                <div className="flex w-full h-full justify-center items-center ">

                    {
                        activeIndex > 0 && <ButtonOk
                            styles={"max-lg:m-0! max-lg:mx-2!  max-lg:px-0! m-4 mx-4 px-8"}
                            classe="w-60 max-lg:w-40 max-lg:px-0! max-md:w-28! max-lg:m-0! !p-3 mb-12 !rounded-2xl font-medium text-lg" type="ok" onClick={() => setActiveIndex(activeIndex - 1)}>
                            Anterior
                        </ButtonOk>
                    }
                    {activeIndex < 2 && <ButtonOk
                        styles={"max-lg:m-0! max-lg:mx-2!  max-lg:px-0! m-4 mx-4 px-8"}
                        classe="w-60 max-lg:w-40 max-lg:px-0! max-md:w-28! max-lg:m-0! !p-3 mb-12 !rounded-2xl font-medium text-lg" type="ok" onClick={() => setActiveIndex(activeIndex + 1)}>
                        Siguiente
                    </ButtonOk>}
                    {
                        activeIndex === 2 &&
                        <ButtonOk
                            styles={"max-lg:m-0! max-lg:mx-2!  max-lg:px-0! m-4 mx-4 px-8"}
                            classe="w-60 max-lg:w-40 max-lg:px-0! max-md:w-28! max-lg:m-0! !p-3 mb-12 !rounded-2xl font-medium text-lg" type="ok" onClick={enviar}>
                            Confirmar
                        </ButtonOk>
                    }
                </div>

            </div>
        </div >);
};

export default FormClientes;