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
    const errorForms = useSelector((state) => state.error);

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
                backgroundImage: "url('PRUEBA2.svg')",
                backgroundSize: "contain",
                backgroundPositionY: "center",
                backgroundPositionX: "center",
            }}
        >
            <PopUp deshabilitar={deshabilitar} />
            <div
                className="flex flex-col max-sm:w-[90%] items-center h-[95%] w-[40%] rounded-4xl shadow-lg overflow-hidden"
                style={{
                    backgroundColor: "rgba(255,255,255,0.64)",
                    backdropFilter: "blur(5px) saturate(120%)",
                    WebkitBackdropFilter: "blur(5px) saturate(120%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <div
                    className="w-full h-[30%]"
                    style={{
                        backgroundImage: "url('PRUEBA1.png')",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                />
                <div
                    className="w-[75%] h-[15%] mt-4"
                    style={{
                        backgroundImage: "url('LOGIN_LOGO.svg')",
                        backgroundSize: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                />

                <div className=" w-[80%] max-sm:w-[120%] rounded-xl  flex flex-col items-center h-[50%] justify-evenly">


                    <h2 style={{
                        fontFamily: "'Exo', sans-serif",
                        fontWeight: 700,
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                    }} className="text-4xl font-bold mb- text-gray-500 text-center">
                        Iniciar sesión
                    </h2>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="flex flex-col  items-center space-y-5 w-full"
                    >
                        {/* USERNAME */}
                        <div className="max-sm:w-[60%] w-[80%] ">
                            <label htmlFor="userName" className="block text-sm text-gray-800 mb-2">
                                Usuario
                            </label>
                            <input
                                id="userName"
                                type="text"
                                autoComplete="username"
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 ${formErrors.userName ? "border-red-500" : "border-gray-300"
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

                        {/* PASSWORD */}
                        <div className="max-sm:w-[60%] w-[80%]">
                            <label htmlFor="password" className="block text-sm text-gray-800 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 ${formErrors.password ? "border-red-500" : "border-gray-300"
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
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
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

                        <div className="flex justify-center w-[60%] ">
                            <button
                                type="submit"
                                className="bg-linear-to-r  from-[#7BCF9E] to-[#3B8359] hover:scale-105 transition-all duration-300 px-4 py-2 rounded-xl text-white w-90 max-sm:w-64 font-medium text-lg mt-4"
                            >
                                Ingresar
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center justify-center my-5">
                        <button
                            type="button"
                            onClick={() => alert("Funcionalidad de 'Olvidé mi contraseña'")}
                            className="text-sm text-[#32B32B] hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                </div>
                <div className=" h-[2%] w-full"></div>
            </div>
        </div>
    );
}

export default Login;
