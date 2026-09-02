import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import socket from "../api/socket";
import { useAuth } from "./AuthContext";

type NotificationItem = {
    _id: string;
    title: string;
    message: string;
    type?: "GLOBAL" | "SUBMODULE" | "INDIVIDUAL";
    module?: string;
    submodule?: string;
    route?: string;
    creator?: string;
    creatorName?: string;
    isReadIndividual?: boolean;
    readBy?: { userId: string | { _id: string }; readAt: string }[];
    createdAt: string;
};

type ToastTone = "success" | "error" | "warning" | "info";

type ToastItem = {
    id: string;
    tone: ToastTone;
    title: string;
    message: string;
};

type NotificationsContextValue = {
    notifications: NotificationItem[];
    unread: number;
    refreshNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    isRead: (notification: NotificationItem) => boolean;
    showToast: (tone: ToastTone, title: string, message: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const toneStyles: Record<ToastTone, { icon: string; className: string }> = {
    success: { icon: "pi pi-check-circle", className: "border-emerald-200 bg-linear-to-br from-emerald-50 to-lime-50 text-emerald-950" },
    error: { icon: "pi pi-times-circle", className: "border-red-200 bg-linear-to-br from-red-50 to-orange-50 text-red-950" },
    warning: { icon: "pi pi-exclamation-triangle", className: "border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50 text-amber-950" },
    info: { icon: "pi pi-info-circle", className: "border-slate-200 bg-linear-to-br from-white to-emerald-50 text-slate-900" },
};

const normalizeText = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.message;
    if (typeof value === "object" && value !== null && "message" in value) {
        const message = (value as { message?: unknown }).message;
        if (typeof message === "string") return message;
        if (Array.isArray(message)) return message.join(", ");
    }
    return "Operacion completada.";
};

export const NotificationsProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unread, setUnread] = useState(0);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (tone: ToastTone, title: string, message: unknown) => {
        const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
        setToasts((current) => [{ id, tone, title, message: normalizeText(message) }, ...current].slice(0, 4));
        window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 5200);
    };

    const refreshNotifications = async () => {
        if (!isAuthenticated) return;
        const response = await axios.get("/herramientas/notificaciones", { params: { page: 0, limit: 8 } });
        setNotifications(response.data.data || []);
        setUnread(response.data.unread || 0);
    };

    const isRead = (notification: NotificationItem) => {
        if (notification.type === "INDIVIDUAL") return Boolean(notification.isReadIndividual);
        return Boolean(notification.readBy?.some((read) => {
            const userId = typeof read.userId === "string" ? read.userId : read.userId?._id;
            return userId?.toString() === user?._id?.toString();
        }));
    };

    const markAsRead = async (id: string) => {
        const selected = notifications.find((item) => item._id === id);
        const wasUnread = selected ? !isRead(selected) : true;
        const response = await axios.patch(`/herramientas/notificaciones/${id}/leida`);
        setNotifications((current) => current.map((item) => item._id === id ? { ...item, ...response.data.data } : item));
        if (wasUnread) setUnread((current) => Math.max(current - 1, 0));
    };

    useEffect(() => {
        if (!isAuthenticated || !user?._id) {
            socket.disconnect();
            setNotifications([]);
            setUnread(0);
            return;
        }

        const submodules = (user.modules || []).map((item) => item.submodule?.name).filter(Boolean);

        socket.connect();
        socket.emit("register_session", { userId: user._id, submodules });
        refreshNotifications();

        const handleNotification = (notification: NotificationItem) => {
            if (notification.creator?.toString() === user._id?.toString()) return;
            const allowed = !notification.submodule || submodules.some((submodule) => submodule.toUpperCase() === notification.submodule?.toUpperCase());
            if (!allowed) return;

            setNotifications((current) => [notification, ...current.filter((item) => item._id !== notification._id)].slice(0, 8));
            setUnread((current) => current + 1);
            showToast("info", notification.title || "Nueva notificacion", notification.message);
        };

        socket.on("nuevaNotificacion", handleNotification);

        return () => {
            socket.off("nuevaNotificacion", handleNotification);
            socket.disconnect();
        };
    }, [isAuthenticated, user?._id]);

    const value = useMemo(() => ({
        notifications,
        unread,
        refreshNotifications,
        markAsRead,
        isRead,
        showToast,
    }), [notifications, unread, user?._id]);

    return (
        <NotificationsContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed right-5 top-5 z-[10000] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
                {toasts.map((toast) => {
                    const style = toneStyles[toast.tone];
                    return (
                        <article key={toast.id} className={`pointer-events-auto flex gap-3 rounded-[26px] border p-4 shadow-[0_22px_55px_rgba(18,24,11,0.16)] backdrop-blur-xl ${style.className}`}>
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/80 shadow-inner">
                                <i className={`${style.icon} text-lg`} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-black">{toast.title}</p>
                                <p className="mt-1 text-sm leading-6 opacity-75">{toast.message}</p>
                            </div>
                            <button
                                type="button"
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/50 transition hover:bg-white"
                                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                                aria-label="Cerrar notificacion"
                            >
                                <i className="pi pi-times text-xs" />
                            </button>
                        </article>
                    );
                })}
            </div>
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) throw new Error("useNotifications debe usarse dentro de NotificationsProvider");
    return context;
};
