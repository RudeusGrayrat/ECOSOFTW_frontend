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
    const { notifications, unread, markAsRead, refreshNotifications } = useNotifications();

    const openNotification = async (notification) => {
        await markAsRead(notification._id);
        if (notification.route) navigate(notification.route);
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
                            className="w-full rounded-3xl border border-slate-100 bg-linear-to-br from-white to-emerald-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                            onClick={() => openNotification(notification)}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-black text-emerald-700">
                                    {notification.module} / {notification.submodule}
                                </span>
                                <span className="text-xs font-semibold text-slate-400">{formatDate(notification.createdAt)}</span>
                            </div>
                            <p className="mt-3 text-xl font-black text-slate-800">{notification.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-500">{notification.message}</p>
                            {notification.creatorName && <p className="mt-3 text-xs font-bold text-slate-400">Por {notification.creatorName}</p>}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Notificaciones;
