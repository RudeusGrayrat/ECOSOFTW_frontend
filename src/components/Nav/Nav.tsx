import { Link } from "react-router-dom";
import Checkbox from "./IconNotification";
import MoreOptions from "./IconProfileAndMore";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";

const Nav = () => {
    const { logout, user } = useAuth();
    const { notifications, unread, markAsRead, refreshNotifications } = useNotifications();

    const salir = () => {
        logout();
    };

    const formatDate = (date) => new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));

    return (
        <div className="flex justify-between  bg-white items-center px-6 h-18 border-b  border-b-stone-200">
            <div className=" flex justify-around  items-center  m-2 rounded-lg ">

            </div>
            {user ? (
                <div className=" flex justify-around items-center m-2  h-1">
                    <MoreOptions
                        content={
                            <div className="relative">
                                <Checkbox />
                                {unread > 0 && (
                                    <div className="absolute -top-6 -right-7 p-[14px] flex justify-center items-center min-w-7 h-7 bg-red-500 rounded-full text-white text-xs font-bold">
                                        {unread > 99 ? "99+" : unread}
                                    </div>
                                )}
                            </div>
                        }
                        children={
                            <div className="w-96 max-h-[70vh] overflow-y-auto">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <p className="font-black text-slate-800">Notificaciones</p>
                                        <p className="text-xs text-slate-400">{unread} sin leer</p>
                                    </div>
                                    <button className="text-xs font-bold text-emerald-600" onClick={refreshNotifications}>
                                        Actualizar
                                    </button>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {notifications.length === 0 && (
                                        <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">Sin notificaciones por ahora.</p>
                                    )}
                                    {notifications.map((notification) => (
                                        <button
                                            key={notification._id}
                                            className="w-full rounded-2xl bg-linear-to-br from-white to-emerald-50 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                            onClick={() => markAsRead(notification._id)}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-700">
                                                    {notification.submodule || notification.module || "ECOSOFT"}
                                                </span>
                                                <span className="text-[11px] text-slate-400">{formatDate(notification.createdAt)}</span>
                                            </div>
                                            <p className="mt-2 font-black text-slate-800">{notification.title}</p>
                                            <p className="mt-1 text-sm leading-5 text-slate-500">{notification.message}</p>
                                            {notification.creatorName && <p className="mt-2 text-xs font-semibold text-slate-400">Por {notification.creatorName}</p>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        }
                    />

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
