import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useNotifications } from "../../context/NotificationsContext";

const PAGE_SIZE = 10;

const formatDate = (date) => new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
}).format(new Date(date));

const Notificaciones = () => {
    const navigate = useNavigate();
    const { unread, markAsRead, refreshNotifications, isRead } = useNotifications();
    const [notifications, setNotifications] = useState([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const hasMore = notifications.length < total;

    const loadNotifications = async (nextPage = 0, append = false) => {
        setLoading(true);
        try {
            const response = await axios.get("/herramientas/notificaciones", {
                params: { page: nextPage, limit: PAGE_SIZE },
            });
            const nextData = response.data.data || [];
            setNotifications((current) => append ? [...current, ...nextData] : nextData);
            setTotal(response.data.total || 0);
            setPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const refreshPage = async () => {
        setSelectedId(null);
        await Promise.all([
            loadNotifications(0, false),
            refreshNotifications(),
        ]);
    };

    const markLocalAsRead = async (notification) => {
        if (isRead(notification)) return;
        const updated = await markAsRead(notification._id);
        if (!updated) return;
        setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, ...updated } : item));
    };

    const openNotification = async (notification, event) => {
        event.stopPropagation();
        await markLocalAsRead(notification);
        if (notification.route) navigate(notification.route);
    };

    const toggleDetail = async (notification) => {
        setSelectedId((current) => current === notification._id ? null : notification._id);
        await markLocalAsRead(notification);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

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
                        className="w-fit rounded-2xl bg-white px-5 py-3 font-black text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={loading}
                        onClick={refreshPage}
                    >
                        {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                </div>
            </section>

            <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-200/70">
                <div className="space-y-2">
                    {notifications.length === 0 && !loading && (
                        <div className="rounded-3xl bg-slate-50 p-8 text-center">
                            <p className="text-lg font-black text-slate-700">Sin notificaciones por ahora</p>
                            <p className="mt-2 text-sm text-slate-400">Cuando otro colaborador cree, edite o elimine registros, aparecerán aquí.</p>
                        </div>
                    )}

                    {notifications.map((notification) => {
                        const opened = selectedId === notification._id;
                        const read = isRead(notification);

                        return (
                            <button
                                key={notification._id}
                                className={`w-full rounded-2xl border bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${read
                                    ? "border-slate-100 opacity-95"
                                    : "border-l-4 border-l-blue-500 border-slate-100 shadow-md"
                                    }`}
                                onClick={() => toggleDetail(notification)}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${read ? "bg-slate-300" : "bg-blue-500 animate-pulse"}`} />
                                        <span className="truncate rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-700">
                                            {notification.module || "SISTEMA"} / {notification.submodule || notification.type}
                                        </span>
                                        <p className="min-w-0 flex-1 truncate text-base font-black text-slate-800">{notification.title}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${read ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"}`}>
                                            {read ? "Leída" : "Nueva"}
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-400">{formatDate(notification.createdAt)}</span>
                                        <i className={`pi pi-chevron-down text-xs text-slate-400 transition ${opened ? "rotate-180" : ""}`} />
                                    </div>
                                </div>

                                <p className={`mt-2 text-sm text-slate-500 ${opened ? "leading-6" : "truncate"}`}>
                                    {notification.message}
                                </p>

                                <div className={`grid transition-all duration-300 ${opened ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                    <div className="overflow-hidden">
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600 shadow-inner">
                                            <p className="font-black text-slate-800">Descripción completa</p>
                                            <p className="mt-1">{notification.detail || notification.message}</p>
                                            {notification.creatorName && <p className="mt-3"><span className="font-bold">Creado por:</span> {notification.creatorName}</p>}
                                            <p><span className="font-bold">Tipo:</span> {notification.type || "SUBMODULE"}</p>
                                            <p><span className="font-bold">Fecha:</span> {formatDate(notification.createdAt)}</p>
                                            {notification.route && (
                                                <span
                                                    className="mt-3 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-md transition hover:bg-emerald-700"
                                                    onClick={(event) => openNotification(notification, event)}
                                                >
                                                    Abrir módulo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-5 flex justify-center">
                    {hasMore ? (
                        <button
                            className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                            disabled={loading}
                            onClick={() => loadNotifications(page + 1, true)}
                        >
                            {loading ? "Cargando..." : `Ver más (${notifications.length}/${total})`}
                        </button>
                    ) : notifications.length > 0 && (
                        <p className="text-xs font-bold text-slate-400">Mostrando todas las notificaciones</p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Notificaciones;
