import { useEffect, useState } from "react";
import ButtonOk from "../../../../components/Ui/Button/Buttons";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";
import GastosOperativos from "./GastosOperativos";
import GastosAdministrativos from "./GastosAdministrativos";
import GastosGenerales from "./GastosGenerales";
import Analisis from "./Analisis";
import Directorio from "../../../../components/Principal/AddRemove/AddRemove";
import Totales from "./totales";
import Proyecto from "./Proyecto";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import { useValidation } from "../validacion";
import { useAuth } from "../../../../context/AuthContext";

const RegisterCotizacionesComercial = ({ }) => {
    const sendMessage = useSendMessage()
    const { user } = useAuth()
    const [habilitar, setHabilitar] = useState(false);
    const [form, setForm] = useState({
        tiempoDeEntrega: [],
        tipoDeServicio: "",
        proyecto_id: "",
        analisis: [
            {
                descripcion: "",
                parametro_id: "",
                cantidad: 0,
                precio: 0,
                subtotal: 0,
            }
        ],
        gastosOperativos: [
            {
                descripcion: "",
                tipoDeGasto_id: "",
                precio: 0,
                cantidad: 0,
                dias: 0,
                subtotal: 0,
            }
        ],
        gastosAdministrativos: [
            {
                descripcion: "",
                tipoDeGasto_id: "",
                precio: 0,
                cantidad: 0,
                subtotal: 0,
            }
        ],
        gastosGenerales: [
            {
                descripcion: "",
                subtotal: 0,
            },
        ],
        totalSinIgv: 0,
        igv: 0,
        totalConIgv: 0,
    });

    const resetForm = () => {
        setForm({
            tiempoDeEntrega: [],
            tipoDeServicio: "",
            proyecto_id: "",
            analisis: [
                {
                    descripcion: "",
                    parametro_id: "",
                    cantidad: 0,
                    precio: 0,
                    subtotal: 0,
                }
            ],
            gastosOperativos: [
                {
                    descripcion: "",
                    tipoDeGasto_id: "",
                    precio: 0,
                    cantidad: 0,
                    dias: 0,
                    subtotal: 0,
                }
            ],
            gastosAdministrativos: [
                {
                    descripcion: "",
                    tipoDeGasto_id: "",
                    precio: 0,
                    cantidad: 0,
                    subtotal: 0,
                }
            ],
            gastosGenerales: [
                {
                    descripcion: "",
                    subtotal: 0,
                },
            ],
            totalSinIgv: 0,
            igv: 0,
            totalConIgv: 0,
        });
        setHabilitar(false);
    }
    const round2 = (n) => Math.round(n * 100) / 100;

    useEffect(() => {
        if (form.analisis) {
            let totalAnalisis = form.analisis.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
            let totalGastosOperativos = form.gastosOperativos.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
            let totalGastosAdministrativos = form.gastosAdministrativos.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
            let totalSinIgv = round2(totalAnalisis + totalGastosOperativos + totalGastosAdministrativos);
            let igv = round2(totalSinIgv * 0.18);
            let totalConIgv = round2(totalSinIgv + igv);
            let analisis = form.analisis.map(analisis => ({
                descripcion: form.tipoDeServicio + " " + analisis.descripcion,
                subtotal: Number(analisis.subtotal) || 0
            }));
            let gastosOperativos = {
                descripcion: "GASTOS OPERATIVOS",
                subtotal: totalGastosOperativos
            };
            let gastosAdministrativos = {
                descripcion: "GASTOS ADMINISTRATIVOS",
                subtotal: totalGastosAdministrativos
            };

            let a = [...analisis, gastosOperativos, gastosAdministrativos];
            setForm(prevForm => ({
                ...prevForm,
                gastosGenerales: a,
                totalSinIgv,
                igv,
                totalConIgv
            }));
        }
    }, [form.analisis, form.gastosOperativos, form.gastosAdministrativos]);
    const { errors, validateForm } = useValidation<typeof form>();
    const register = async () => {
        setHabilitar(true);
        const isValid = validateForm(form);
        try {
            if (!isValid) {
                return sendMessage("Por favor, complete todos los campos obligatorios.", "Error")
            }
            if (!user) {
                return sendMessage("Usuario no autenticado.", "Error")
            }
            const response = await axios.post("/comercial/postCotizacion", {
                ...form,
                creadoPor: user._id,
            });
            const data = response.data;
            if (data.message)
                sendMessage(data.message, data.type);
            resetForm();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setHabilitar(false);
        }
    }
    return (
        <div className="px-5 ">
            <PopUp deshabilitar={habilitar} />
            <CardPlegable title="Datos de Proyecto">
                <Proyecto form={form} setForm={setForm} />
            </CardPlegable>
            <CardPlegable title="Gastos Operativos">
                <Directorio
                    estilos="flex justify-center items-center"
                    ItemComponent={GastosOperativos}
                    directory={form?.gastosOperativos}
                    data="gastosOperativos"
                    setForm={setForm}
                />
            </CardPlegable>
            <CardPlegable title="Gastos Administrativos">
                <Directorio
                    estilos="flex justify-center items-center"
                    ItemComponent={GastosAdministrativos}
                    directory={form?.gastosAdministrativos}
                    data="gastosAdministrativos"
                    setForm={setForm}
                />
            </CardPlegable>
            <CardPlegable title="Análisis de Cotización">
                <Directorio
                    estilos="flex justify-center items-center"
                    ItemComponent={Analisis}
                    directory={form.analisis}
                    data="analisis"
                    setForm={setForm}
                />
            </CardPlegable>
            <CardPlegable title="Gastos Generales">
                {form.gastosGenerales.length > 0 && (
                    form.gastosGenerales.map((item, index) => (
                        <GastosGenerales
                            form={item}
                        />
                    ))
                )}
            </CardPlegable>
            <CardPlegable title="Totales">
                <Totales form={form} setForm={setForm} />
            </CardPlegable>
            <div className="flex flex-col mx-5">
                <div className="flex justify-center m-10 ">
                    <ButtonOk
                        type="ok"
                        onClick={register}
                        classe="!w-80"
                        children="Registrar"
                    />
                </div>
            </div>
        </div>
    )
}

export default RegisterCotizacionesComercial;