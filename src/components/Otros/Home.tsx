import { useEffect, useState } from "react";
import axios from "../../api/axios";

type EstadoItem = {
    estado: string;
    total: number;
};

type TendenciaItem = {
    mes: string;
    total: number;
    monto?: number;
};

type ClienteTop = {
    cliente: string;
    cotizaciones: number;
    monto: number;
};

type ActividadItem = {
    tipo: string;
    titulo: string;
    detalle: string;
    fecha: string;
};

type DashboardData = {
    indicadores: {
        clientes: { total: number; activos: number };
        cotizaciones: { total: number; aprobadas: number; pendientes: number; montoTotal: number };
        proyectos: { total: number; activos: number };
        informes: { total: number; disponibles: number };
        herramientas: {
            usuarios: number;
            usuariosActivos: number;
            modulosActivos: number;
            submodulosActivos: number;
            permisosActivos: number;
        };
    };
    graficos: {
        estadosCotizaciones: EstadoItem[];
        estadosClientes: EstadoItem[];
        estadosProyectos: EstadoItem[];
        estadosInformes: EstadoItem[];
        tendenciaCotizaciones: TendenciaItem[];
        tendenciaInformes: TendenciaItem[];
        clientesTop: ClienteTop[];
    };
    actividad: ActividadItem[];
};

const emptyDashboard: DashboardData = {
    indicadores: {
        clientes: { total: 0, activos: 0 },
        cotizaciones: { total: 0, aprobadas: 0, pendientes: 0, montoTotal: 0 },
        proyectos: { total: 0, activos: 0 },
        informes: { total: 0, disponibles: 0 },
        herramientas: { usuarios: 0, usuariosActivos: 0, modulosActivos: 0, submodulosActivos: 0, permisosActivos: 0 },
    },
    graficos: {
        estadosCotizaciones: [],
        estadosClientes: [],
        estadosProyectos: [],
        estadosInformes: [],
        tendenciaCotizaciones: [],
        tendenciaInformes: [],
        clientesTop: [],
    },
    actividad: [],
};

const formatCurrency = (value = 0) => new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
}).format(value);

const formatNumber = (value = 0) => new Intl.NumberFormat("es-PE").format(value);

const formatMonth = (month: string) => {
    const [, monthNumber] = month.split("-");
    return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"][Number(monthNumber) - 1] || month;
};

const formatDate = (date: string) => new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
}).format(new Date(date));

const statusColors: Record<string, string> = {
    ACTIVO: "bg-emerald-500",
    APROBADO: "bg-green-500",
    BORRADOR: "bg-amber-400",
    PRELIMINAR: "bg-sky-500",
    LIBERADO: "bg-lime-500",
    DISPONIBLE: "bg-lime-500",
    PENDIENTE: "bg-amber-400",
    COTIZADO: "bg-sky-500",
    INACTIVO: "bg-slate-400",
    ANULADO: "bg-red-500",
    "NO DISPONIBLE": "bg-rose-500",
};

const MetricCard = ({ title, value, subtitle, accent }: { title: string; value: string; subtitle: string; accent: string }) => (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 border border-slate-100">
        <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${accent} opacity-15`} />
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-800">{value}</h3>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
);

const StatusBars = ({ title, data }: { title: string; data: EstadoItem[] }) => {
    const total = data.reduce((sum, item) => sum + item.total, 0);

    return (
        <section className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 border border-slate-100">
            <h3 className="text-lg font-black text-slate-800">{title}</h3>
            <div className="mt-5 space-y-4">
                {data.length === 0 && <p className="text-sm text-slate-400">Sin registros todavía.</p>}
                {data.map((item) => {
                    const width = total ? Math.max((item.total / total) * 100, 6) : 0;
                    return (
                        <div key={item.estado}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="font-bold text-slate-600">{item.estado}</span>
                                <span className="text-slate-500">{formatNumber(item.total)}</span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                <div className={`h-full rounded-full ${statusColors[item.estado] || "bg-teal-500"}`} style={{ width: `${width}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const TrendChart = ({ title, data, valueLabel }: { title: string; data: TendenciaItem[]; valueLabel: "total" | "monto" }) => {
    const max = Math.max(...data.map((item) => Number(item[valueLabel]) || 0), 1);

    return (
        <section className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 border border-slate-100">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800">{title}</h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">12 meses</span>
            </div>
            <div className="mt-6 flex h-52 items-end gap-3">
                {data.map((item) => {
                    const value = Number(item[valueLabel]) || 0;
                    const height = Math.max((value / max) * 100, value ? 8 : 2);
                    return (
                        <div key={item.mes} className="flex flex-1 flex-col items-center gap-2">
                            <div className="flex h-40 w-full items-end rounded-2xl bg-slate-50 px-1">
                                <div
                                    className="w-full rounded-2xl bg-linear-to-t from-emerald-500 to-lime-300 shadow-md shadow-emerald-100"
                                    title={`${item.mes}: ${valueLabel === "monto" ? formatCurrency(value) : formatNumber(value)}`}
                                    style={{ height: `${height}%` }}
                                />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400">{formatMonth(item.mes)}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const TopClients = ({ data }: { data: ClienteTop[] }) => (
    <section className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 border border-slate-100">
        <h3 className="text-lg font-black text-slate-800">Clientes con mayor cotización</h3>
        <div className="mt-5 space-y-4">
            {data.length === 0 && <p className="text-sm text-slate-400">Aún no hay ranking de clientes.</p>}
            {data.map((item, index) => (
                <div key={`${item.cliente}-${index}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                        <p className="font-black text-slate-700">{item.cliente}</p>
                        <p className="text-sm text-slate-500">{item.cotizaciones} cotizaciones</p>
                    </div>
                    <span className="font-black text-emerald-600">{formatCurrency(item.monto)}</span>
                </div>
            ))}
        </div>
    </section>
);

const Activity = ({ data }: { data: ActividadItem[] }) => {
    const visibleData = data.slice(0, 8);

    return (
        <section className="h-full max-h-[500px] rounded-3xl bg-slate-900 p-5 text-white shadow-xl shadow-slate-300/80">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-black">Actividad reciente</h3>
                    <p className="text-xs font-semibold text-slate-400">Últimos movimientos del sistema</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-200">
                    {formatNumber(data.length)}
                </span>
            </div>
            <div className="mt-5 max-h-[395px] space-y-3 overflow-y-auto pr-1">
                {visibleData.length === 0 && <p className="text-sm text-slate-400">Sin actividad registrada.</p>}
                {visibleData.map((item, index) => (
                    <div key={`${item.tipo}-${item.titulo}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">{item.tipo}</span>
                            <span className="text-xs text-slate-400">{formatDate(item.fecha)}</span>
                        </div>
                        <p className="mt-3 font-black">{item.titulo}</p>
                        <p className="mt-1 text-sm text-slate-300">{item.detalle}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const Home = () => {
    const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get("/dashboard/resumen");
            setDashboard(response.data);
        } catch (requestError: any) {
            setError(requestError?.response?.data?.message || "No se pudo cargar el dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const { indicadores, graficos, actividad } = dashboard;

    return (
        <main className="min-h-full w-full overflow-y-auto bg-linear-to-br from-slate-50 via-emerald-50/50 to-white px-8 py-7">
            <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-7 text-white shadow-2xl shadow-emerald-100">
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-2xl" />
                <div className="absolute bottom-0 right-36 h-24 w-24 rounded-full bg-lime-300/20 blur-xl" />
                <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-200">ECOSOFT</p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight">Panel de control</h1>
                        <p className="mt-2 max-w-2xl text-slate-300">Indicadores vivos de comercial, calidad y herramientas para ver el pulso del sistema sin entrar módulo por módulo.</p>
                    </div>
                    <button
                        onClick={loadDashboard}
                        className="w-fit rounded-2xl bg-white px-5 py-3 font-black text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-100"
                    >
                        Actualizar
                    </button>
                </div>
            </section>

            {error && (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 font-semibold text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-36 animate-pulse rounded-3xl bg-white shadow-lg shadow-slate-200/70" />
                    ))}
                </div>
            ) : (
                <>
                    <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_420px]">
                        <div className="grid gap-5 md:grid-cols-2">
                            <MetricCard title="Clientes" value={formatNumber(indicadores.clientes.total)} subtitle={`${formatNumber(indicadores.clientes.activos)} activos`} accent="bg-emerald-500" />
                            <MetricCard title="Cotizaciones" value={formatNumber(indicadores.cotizaciones.total)} subtitle={`${formatNumber(indicadores.cotizaciones.aprobadas)} aprobadas / ${formatNumber(indicadores.cotizaciones.pendientes)} pendientes`} accent="bg-amber-400" />
                            <MetricCard title="Monto cotizado" value={formatCurrency(indicadores.cotizaciones.montoTotal)} subtitle="Total con IGV acumulado" accent="bg-sky-500" />
                            <MetricCard title="Informes de ensayo" value={formatNumber(indicadores.informes.total)} subtitle={`${formatNumber(indicadores.informes.disponibles)} disponibles para clientes`} accent="bg-lime-500" />
                            <MetricCard title="Proyectos" value={formatNumber(indicadores.proyectos.total)} subtitle={`${formatNumber(indicadores.proyectos.activos)} activos o cotizados`} accent="bg-cyan-500" />
                            <MetricCard title="Usuarios activos" value={formatNumber(indicadores.herramientas.usuariosActivos)} subtitle={`${formatNumber(indicadores.herramientas.usuarios)} usuarios registrados`} accent="bg-teal-500" />
                        </div>
                        <Activity data={actividad} />
                    </section>

                    <section className="mt-5 grid gap-5 lg:grid-cols-1">
                        <MetricCard title="Arquitectura" value={`${formatNumber(indicadores.herramientas.modulosActivos)} / ${formatNumber(indicadores.herramientas.submodulosActivos)}`} subtitle={`${formatNumber(indicadores.herramientas.permisosActivos)} permisos activos entre módulos y submódulos`} accent="bg-slate-700" />
                    </section>

                    <section className="mt-6 grid gap-5 xl:grid-cols-2">
                        <TrendChart title="Cotizaciones por mes" data={graficos.tendenciaCotizaciones} valueLabel="total" />
                        <TrendChart title="Monto cotizado por mes" data={graficos.tendenciaCotizaciones} valueLabel="monto" />
                    </section>

                    <section className="mt-6 grid gap-5 xl:grid-cols-2">
                        <TrendChart title="Informes procesados por mes" data={graficos.tendenciaInformes} valueLabel="total" />
                        <TopClients data={graficos.clientesTop} />
                    </section>

                    <section className="mt-6 grid gap-5 xl:grid-cols-4">
                        <StatusBars title="Estados de cotizaciones" data={graficos.estadosCotizaciones} />
                        <StatusBars title="Estados de proyectos" data={graficos.estadosProyectos} />
                        <StatusBars title="Estados de clientes" data={graficos.estadosClientes} />
                        <StatusBars title="Estados de informes" data={graficos.estadosInformes} />
                    </section>

                    <section className="mt-6">
                        <section className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 border border-slate-100">
                            <h3 className="text-lg font-black text-slate-800">Lectura rapida</h3>
                            <div className="mt-5 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-emerald-50 p-4">
                                    <p className="text-sm font-bold text-emerald-700">Conversion comercial</p>
                                    <p className="mt-2 text-2xl font-black text-emerald-950">
                                        {indicadores.cotizaciones.total ? Math.round((indicadores.cotizaciones.aprobadas / indicadores.cotizaciones.total) * 100) : 0}%
                                    </p>
                                    <p className="text-sm text-emerald-700">cotizaciones aprobadas</p>
                                </div>
                                <div className="rounded-2xl bg-amber-50 p-4">
                                    <p className="text-sm font-bold text-amber-700">Carga pendiente</p>
                                    <p className="mt-2 text-2xl font-black text-amber-950">{formatNumber(indicadores.cotizaciones.pendientes)}</p>
                                    <p className="text-sm text-amber-700">cotizaciones por decidir</p>
                                </div>
                                <div className="rounded-2xl bg-sky-50 p-4">
                                    <p className="text-sm font-bold text-sky-700">Acceso documental</p>
                                    <p className="mt-2 text-2xl font-black text-sky-950">
                                        {indicadores.informes.total ? Math.round((indicadores.informes.disponibles / indicadores.informes.total) * 100) : 0}%
                                    </p>
                                    <p className="text-sm text-sky-700">informes consultables</p>
                                </div>
                            </div>
                        </section>
                    </section>
                </>
            )}
        </main>
    );
};

export default Home;
