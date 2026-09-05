import { Link, useNavigate } from "react-router-dom";
import Checkbox from "./IconNotification";
import MoreOptions from "./IconProfileAndMore";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";

const Nav = () => {
    const { logout, user } = useAuth();
    const { unread } = useNotifications();
    const navigate = useNavigate();

    const salir = () => {
        logout();
    };

    return (
        <div className="flex justify-between  bg-white items-center px-6 h-18 border-b  border-b-stone-200">
            <div className=" flex justify-around  items-center  m-2 rounded-lg ">

            </div>
            {user ? (
                <div className=" flex justify-around items-center m-2  h-1">
                    <button
                        onClick={() => navigate("/notificaciones")}
                        className="relative bg-slate-200 flex justify-center items-center w-16 m-4 h-16 rounded-full"
                        data-pr-tooltip="Notificaciones"
                        data-pr-position="bottom"
                    >
                        <Checkbox />
                        {unread > 0 && (
                            <div className="absolute top-1 right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black leading-none text-white shadow-lg ring-2 ring-white">
                                {unread > 99 ? "99+" : unread}
                            </div>
                        )}
                    </button>

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
