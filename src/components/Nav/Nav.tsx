import { Link, useLocation } from "react-router-dom";
import Checkbox from "./IconNotification";
import MoreOptions from "./IconProfileAndMore";
import { BreadCrumb } from "primereact/breadcrumb";
import { useAuth } from "../../context/AuthContext";
const Nav = ({ notifications }) => {
    const { logout, user } = useAuth();

    const location = useLocation();
    const salir = () => {
        logout();
    };
    // --- Función para capitalizar ---
    const capitalize = (str = "") =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // --- 1. Obtener módulo y submódulo desde la URL ---
    const pathParts = location.pathname.split("/").filter(Boolean);
    const modulo = decodeURIComponent(pathParts[0] || "");
    const submodulo = decodeURIComponent(pathParts[1] || "");


    // --- 2. Obtener la acción desde query params ---
    const searchParams = new URLSearchParams(location.search);
    const accion = decodeURIComponent(searchParams.get("select") || "");

    // --- 3. Crear breadcrumb dinámicamente ---
    const items = [];

    if (modulo) {
        items.push({
            label: capitalize(modulo),
            template: () => (
                <Link to={`/${modulo}`} className="text-center flex justify-center items-center">
                    <div className="w-[10px] h-[10px] bg-[#185D29] rounded-full mr-2 mt-1">{" "}</div>
                    <span className="text-[#21823A] font-semibold">
                        {capitalize(modulo)}
                    </span>
                </Link>
            )
        });
    }

    if (submodulo) {
        items.push({
            label: capitalize(submodulo),
            template: () => (
                <Link to={`/${modulo}/${submodulo}?select=Listar`}>
                    <span className="text-[#2BA64A] font-semibold">
                        {capitalize(submodulo)}
                    </span>
                </Link>
            )
        });
    }
    const allowedActions = ["Listar", "Editar", "Ver", "Eliminar", "Crear", "Reportar", "Excel"];
    if (allowedActions.includes(accion)) {
        items.push({
            label: capitalize(accion),
            template: () => (
                <span className="text-[#46CF69]! font-semibold">
                    {capitalize(accion)}
                </span>
            )
        });
    }
    return (
        <div className="flex justify-between  bg-white items-center px-6 h-18 border-b  border-b-stone-200">
            <div className=" flex justify-around  items-center  m-2 rounded-lg ">
                {/* <span className="text-green-500 text-xl">
                    {"Bienvenido Miguel Nicolas > Home"}
                </span> */}
                <BreadCrumb className="border-none! text-xl! "
                    model={items} />
                {/* <img src={imagen} alt="buscador" className="w-10 bg-white h-200" />
        <SearchBar></SearchBar> */}
            </div>
            {user ? (
                <div className=" flex justify-around items-center m-2  h-1">
                    <Link to="/notificaciones">
                        <div className="relative bg-slate-200 flex justify-center items-center w-16 m-4 h-16 rounded-full">
                            {/* <NotificationListener
                userId={user._id}
                onNewNotification={handleNewNotification}
              /> */}
                            <Checkbox />
                            {notifications.length > 0 && (
                                <div className="absolute top-0 -right-2 p-[14px] flex justify-center items-center w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold">
                                    {notifications.length}
                                </div>
                            )}
                        </div>
                    </Link>

                    <MoreOptions
                        content={
                            <img
                                className=" cursor-pointer rounded-full h-16 w-16 shadow-md shadow-gray-200 active:shadow-inner object-cover"
                                src={user.photo ? user.photo : "/ALLPROFILE.png"}
                                alt={user.name?.split(" ")[0] || "foto"}

                            />
                        }
                        children={
                            <div className="flex flex-col justify-center items-start">
                                <a
                                    className="m-2 w-full text-start"
                                    href={`/profile?id=${user._id}`}
                                >
                                    Perfil
                                </a>
                                <a className="m-2 w-full text-start" href="/settings">
                                    Configuración
                                </a>
                                <button
                                    className="m-2 w-full text-start cursor-pointer"
                                    onClick={salir}
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        }
                        classname1="mr-0"
                    />
                </div>
            ) : (
                <div>
                    <Link to="/">Sign In</Link>
                </div>
            )}
        </div>
    );
};

export default Nav;
