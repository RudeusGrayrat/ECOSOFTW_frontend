import { FormEvent, useState } from "react";
import axios from "../../../api/axios";

export default function ConsultaInforme() {
  const [codigo, setCodigo] = useState(() => new URLSearchParams(window.location.search).get("codigo") || "");
  const [idAcceso, setIdAcceso] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMensaje("");
    setResultado(null);
    try {
      const { data } = await axios.post("/calidad/publico/informes-ensayo", { codigo, idAcceso });
      setResultado(data);
    } catch (error: any) {
      setMensaje(error?.response?.data?.message || "Informe o ID de acceso no válidos");
    } finally {
      setLoading(false);
    }
  };

  const pdfUrl = (download = false) => {
    if (!resultado?.viewToken) return "";
    const params = new URLSearchParams({ token: resultado.viewToken });
    if (download) params.set("download", "true");
    return `${import.meta.env.VITE_SERVER_URL}/calidad/publico/informes-ensayo/archivo?${params.toString()}`;
  };

  const reset = () => {
    setCodigo("");
    setIdAcceso("");
    setResultado(null);
    setMensaje("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-950 via-slate-950 to-emerald-800 px-6 py-8 text-slate-900">
      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.09)_0,transparent_28%),radial-gradient(circle_at_80%_30%,rgba(190,242,100,0.12)_0,transparent_24%)]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <div className="text-white">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/95 p-3 shadow-2xl shadow-emerald-950/30 ring-1 ring-white/40">
                <img src="/ecology-logo.svg" alt="Ecology" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-lime-200">ECOLOGY</p>
                <p className="text-sm text-emerald-100">Consulta publica de informes via ECOSOFT</p>
              </div>
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight">
              Verifica tu informe de ensayo de forma segura.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/80">
              Ingresa el codigo del informe y el ID de acceso entregado por Ecology. Si los datos coinciden, podras ver o descargar el PDF autorizado.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black">1</p>
                <p className="mt-1 text-sm text-emerald-100">Ingresa codigo</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black">2</p>
                <p className="mt-1 text-sm text-emerald-100">Valida ID</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black">3</p>
                <p className="mt-1 text-sm text-emerald-100">Abre el PDF</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/30 bg-white/95 p-7 shadow-2xl shadow-emerald-950/40 backdrop-blur">
            {!resultado ? (
              <form onSubmit={submit}>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-700">Portal de cliente</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900">Consulta de informe</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Usa los datos impresos o enviados junto con tu informe.</p>

                <label className="mt-7 block text-sm font-black text-slate-700">Codigo del informe</label>
                <input
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg font-bold uppercase outline-none transition focus:border-emerald-400 focus:bg-white focus:shadow-lg"
                  value={codigo}
                  placeholder="Ej. 260714"
                  onChange={(event) => setCodigo(event.target.value.toUpperCase())}
                />

                <label className="mt-5 block text-sm font-black text-slate-700">ID de acceso</label>
                <input
                  required
                  maxLength={8}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg font-bold uppercase tracking-[0.2em] outline-none transition focus:border-emerald-400 focus:bg-white focus:shadow-lg"
                  value={idAcceso}
                  placeholder="Ej. A1B2C3D4"
                  onChange={(event) => setIdAcceso(event.target.value.toUpperCase())}
                />

                <button
                  disabled={loading}
                  className="mt-7 w-full rounded-2xl bg-emerald-600 py-4 text-lg font-black text-white shadow-xl shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {loading ? "Consultando..." : "Consultar informe"}
                </button>
                {mensaje && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{mensaje}</p>}
              </form>
            ) : (
              <div>
                <div className="rounded-3xl bg-emerald-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-700">Informe encontrado</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-900">{resultado.codigo}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {resultado.tipoVersion || resultado.estado || "Version"} disponible para consulta.
                  </p>
                </div>

                <div className="mt-6 grid gap-3">
                  <a
                    href={pdfUrl(false)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-slate-950 px-5 py-4 text-center font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Ver PDF
                  </a>
                  <a
                    href={pdfUrl(true)}
                    className="rounded-2xl bg-emerald-600 px-5 py-4 text-center font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700"
                  >
                    Descargar PDF
                  </a>
                  <button
                    onClick={reset}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    Nueva consulta
                  </button>
                </div>
                <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                  Por seguridad, este acceso temporal puede vencer. Si ocurre, realiza la consulta nuevamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
