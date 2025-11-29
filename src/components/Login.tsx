import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PopUp from "./Ui/Messages/PopUp";
import { useAuth } from "../context/AuthContext";
import useSendMessage from "./Ui/Messages/sendMessage";

function Login() {
    const navigate = useNavigate();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const { signin, isAuthenticated, errors, setErrors } = useAuth();
    const sendMessage = useSendMessage();
    const errorForms = useSelector((state) => state.errorAndResponse);

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm();

    useEffect(() => {
        if (isAuthenticated) {
            const lastRoute = localStorage.getItem("lastRoute") || "/home";
            localStorage.removeItem("lastRoute");
            navigate(lastRoute);
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        setDeshabilitar(true);
        sendMessage("Cargando...", "Espere");
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await signin(data);
            if (errors) {
                sendMessage(errors, "Error");
                return setErrors(null);
            }
        } catch (error) {
            sendMessage("Error al iniciar sesión", "Error");
        } finally {
            setDeshabilitar(false);
            sendMessage("", "");
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen h-screen flex justify-center items-center w-screen"
            style={{
                backgroundImage: "url('FONDO_ECOSOFTW.svg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPositionY: "center",
                backgroundPositionX: "center",
            }}
        >
            <PopUp deshabilitar={deshabilitar} />
            <div
                className="flex flex-col max-lg:w-[90%]  items-center h-[95%] w-[40%] rounded-4xl shadow-lg overflow-hidden"

            >

                <div
                    className="w-full h-[50%] relative items-center flex justify-center"
                    style={{
                        backgroundImage: "url('FONDO_ECOSOFTW.svg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                >
                    <div
                        className="w-[75%] absolute -bottom-2 z-50 h-[15%] mt-4"
                        style={{
                            backgroundImage: "url('ECOSOFTW_NAME.png')",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom",
                        }}
                    />
                </div>

                <div className=" w-full  max-sm:w-[120%]   flex flex-col items-center h-[50%] justify-evenly"
                    style={{
                        backgroundColor: "rgba(60,90,78,0.74)",
                        backdropFilter: "blur(5px) saturate(120%)",
                        WebkitBackdropFilter: "blur(5px) saturate(120%)",
                    }}
                >

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="flex flex-col  items-center space-y-5 w-full"
                    >


                        <h2 style={{
                            fontFamily: "'Exo', sans-serif",
                            fontWeight: 700,
                            WebkitFontSmoothing: "antialiased",
                            MozOsxFontSmoothing: "grayscale",
                        }} className="text-4xl font-bold  text-gray-50 text-center">
                            Iniciar sesión
                        </h2>
                        {/* USERNAME */}
                        <div className="max-sm:w-[60%] w-[50%] ">
                            <label htmlFor="userName" className="block text-sm text-gray-50 mb-2">
                                Usuario
                            </label>
                            <div className="relative">
                                <span >
                                    <img
                                        src="/ICON-LOGIN-1.png"
                                        alt="Icon"
                                        className="absolute top-1/2 -translate-y-1/2 h-5 flex items-center left-4"
                                    />
                                </span>
                                <input
                                    id="userName"
                                    type="text"
                                    autoComplete="username"
                                    className={`w-full text-white bg-linear-to-tl from-[#81A38B] to-[#679173]  px-3 pl-13 py-2 border rounded-xl focus:outline-none  ${formErrors.userName ? "border-red-500" : "border-gray-300 focus:ring-1 focus:ring-green-500"
                                        }`}
                                    {...register("userName", {
                                        required: "El usuario es requerido",
                                    })}
                                />
                                {formErrors.userName && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {formErrors.userName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="max-sm:w-[60%] w-[50%]">
                            <label htmlFor="password" className="block  text-sm text-white mb-1">
                                Contraseña
                            </label>
                            <div className="relative">

                                <span>
                                    <img
                                        src="/ICON-LOGIN-2.png"
                                        alt="Icon"
                                        className="absolute top-1/2 -translate-y-1/2 h-5 flex items-center left-4"
                                    />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className={`w-full bg-linear-to-tl! from-[#81A38B]! to-[#679173]! px-3 text-white  pl-13 py-2 border rounded-xl focus:outline-none  ${formErrors.password ? "border-red-500" : "border-gray-300 focus:ring-1 focus:ring-green-500"
                                        }`}
                                    {...register("password", {
                                        required: "La contraseña es requerida",
                                        minLength: {
                                            value: 6,
                                            message: "Debe tener al menos 6 caracteres",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute h-[90%] w-20 bg-[#3b8359] z-50 right-[1.9px] top-1/2 -translate-y-1/2 text-sm text-gray-50 px-2 py-1 rounded-r-lg hover:scale-95 hover:text-black hover:bg-[#54b97e] transition-all duration-300"
                                >
                                    {showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            {formErrors.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {formErrors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-center w-[30%] ">
                            <button
                                type="submit"
                                className="bg-linear-to-r  from-[#7BCF9E] to-[#3B8359] hover:scale-105 transition-all duration-300 px-4 py-2 rounded-xl text-white w-90 max-sm:w-64 font-medium text-lg mt-4"
                            >
                                Ingresar
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

export default Login;
