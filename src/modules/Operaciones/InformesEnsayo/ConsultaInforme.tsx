import { FormEvent, useState } from "react";
import axios from "../../../api/axios";

export default function ConsultaInforme() {
  const [codigo, setCodigo] = useState("");
  const [idAcceso, setIdAcceso] = useState("");
  const [mensaje, setMensaje] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/operaciones/publico/informes-ensayo", { codigo, idAcceso });
      const url = `${import.meta.env.VITE_SERVER_URL}/operaciones/publico/informes-ensayo/archivo?token=${data.viewToken}`;
      window.open(url, "_blank");
      setMensaje("");
    } catch (_) {
      setMensaje("Informe o ID de acceso no válidos");
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold">Consulta de informe</h1>
        <p className="text-slate-500 mt-2">Ingresa el código del informe y el ID de acceso entregado.</p>
        <input
          required
          className="border rounded w-full p-3 mt-6"
          value={codigo}
          placeholder="Código del informe"
          onChange={(event) => setCodigo(event.target.value.toUpperCase())}
        />
        <input
          required
          maxLength={8}
          className="border rounded w-full p-3 mt-4"
          value={idAcceso}
          placeholder="ID de acceso"
          onChange={(event) => setIdAcceso(event.target.value.toUpperCase())}
        />
        <button className="mt-4 bg-emerald-700 text-white rounded w-full py-3 font-semibold">Ver informe</button>
        {mensaje && <p className="text-red-600 mt-4">{mensaje}</p>}
      </form>
    </main>
  );
}
