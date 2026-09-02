import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";

const formatDate = (date) => new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
}).format(new Date(date));

const Notificaciones = () => {
    const navigate = useNavigate();
    const { notifications, unread, markAsRead, refreshNotifications, isRead } = useNotifications();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const openNotification = async (notification, event) => {
        event.stopPropagation();
        if (!isRead(notification)) await markAsRead(notification._id);
        if (notification.route) navigate(notification.route);
    };

    const toggleDetail = async (notification) => {
        setSelectedId((current) => current === notification._id ? null : notification._id);
        if (!isRead(notification)) await markAsRead(notification._id);
    };

    return (
        <main className="min-h-full w-full overflow-y-auto bg-linear-to-br from-slate-50 via-emerald-50/50 to-white px-8 py-7">
            <section className="rounded-[2rem] bg-slate-950 px-8 py-7 text-white shadow-2xl shadow-emerald-100">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-200">ECOSOFT</p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight">Notificaciones</h1>
                        <p className="mt-2 text-slate-300">{unread} notificaciones sin leer de acciones realizadas por otros colaboradores.</p>
                    </div>
                    <button
                        className="w-fit rounded-2xl bg-white px-5 py-3 font-black text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-100"
                        onClick={refreshNotifications}
                    >
                        Actualizar
                    </button>
                </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 border border-slate-100">
                <div className="space-y-3">
                    {notifications.length === 0 && (
                        <div className="rounded-3xl bg-slate-50 p-8 text-center">
                            <p className="text-lg font-black text-slate-700">Sin notificaciones por ahora</p>
                            <p className="mt-2 text-sm text-slate-400">Cuando otro colaborador cree, edite o elimine registros, apareceran aqui.</p>
                        </div>
                    )}

                    {notifications.map((notification) => (
                        <button
                            key={notification._id}
                            className={`w-full rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${isRead(notification)
                                ? "border-slate-100 opacity-90"
                                : "border-l-4 border-l-blue-500 border-slate-100 shadow-md"
                                }`}
                            onClick={() => toggleDetail(notification)}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className={`h-3 w-3 shrink-0 rounded-full ${isRead(notification) ? "bg-slate-300" : "bg-blue-500 animate-pulse"}`} />
                                    <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-black text-emerald-700">
                                        {notification.module || "SISTEMA"} / {notification.submodule || notification.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${isRead(notification) ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"}`}>
                                        {isRead(notification) ? "Leida" : "Nueva"}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">{formatDate(notification.createdAt)}</span>
                                </div>
                            </div>
                            <p className="mt-3 text-xl font-black text-slate-800">{notification.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-500">{notification.message}</p>
                            <div className={`grid transition-all duration-300 ${selectedId === notification._id ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600 shadow-inner">
                                        <p className="font-black text-slate-800">Descripción completa</p>
                                        <p className="mt-1">{notification.detail || notification.message}</p>
                                        {notification.creatorName && <p className="mt-3"><span className="font-bold">Creado por:</span> {notification.creatorName}</p>}
                                        <p><span className="font-bold">Tipo:</span> {notification.type || "SUBMODULE"}</p>
                                        <p><span className="font-bold">Fecha:</span> {formatDate(notification.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                {notification.creatorName && <p className="text-xs font-bold text-slate-400">Por {notification.creatorName}</p>}
                                {notification.route && (
                                    <span
                                        className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-md transition hover:bg-emerald-700"
                                        onClick={(event) => openNotification(notification, event)}
                                    >
                                        Abrir módulo
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Notificaciones;
