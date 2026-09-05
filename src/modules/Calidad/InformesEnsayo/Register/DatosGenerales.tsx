import InputP from "../../../../components/Ui/Input/InputP";

const DatosGenerales = ({ form, setForm, files, setFiles }) => {
    const parseFileName = (file) => {
        const baseName = file.name.replace(/\.[^.]+$/, "").trim();
        const codeMatch = baseName.match(/^([A-Z]*_?IE_)?(\d{6}(?:-I)?)/i) || baseName.match(/^(\d{6}(?:-I)?)/);
        const pmMatch = baseName.match(/\(\s*PM\s+([^)]+)\)/i);
        const afterPm = baseName.split(/\)\s*/).slice(1).join(") ").trim();
        const matrizMatch = afterPm.match(/-\s*([^-()]+)$/) || baseName.match(/-\s*([^-()]+)$/);
        const cliente = afterPm.replace(/-\s*([^-()]+)$/, "").trim();

        return {
            id: `${file.name}-${file.size}-${file.lastModified}`,
            file,
            codigo: (codeMatch?.[2] || codeMatch?.[1] || "").toUpperCase(),
            planMonitoreo: (pmMatch?.[1] || "").replace(/\s+/g, " ").trim().toUpperCase(),
            cliente: cliente.replace(/\s+/g, " ").trim().toUpperCase(),
            matriz: (matrizMatch?.[1] || "").replace(/\s+/g, " ").trim().toUpperCase(),
        };
    }

    const addFiles = (selectedFiles) => {
        const nextFiles = Array.from(selectedFiles || [])
            .filter((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
            .map(parseFileName);

        setFiles((prev) => {
            const existing = new Set(prev.map((item) => item.id));
            return [...prev, ...nextFiles.filter((item) => !existing.has(item.id))];
        });
    }

    const updateFile = (id, field, value) => {
        setFiles((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value.toUpperCase() } : item));
    }

    const removeFile = (id) => {
        setFiles((prev) => prev.filter((item) => item.id !== id));
    }

    return (
        <div className="flex flex-col gap-5">
            <p className="mx-3 text-sm font-semibold text-slate-500">
                Carga uno o varios borradores. ECOSOFT detectará código, plan de monitoreo, cliente y matriz desde nombres como: 260705 (PM 004-2607) PICCONE ROSALES - RUIDO.
            </p>
            <div className="flex flex-wrap">
                <InputP
                    label="Acreditación"
                    name="tipoPlantilla"
                    type="select"
                    ancho="w-80!"
                    options={[
                        { label: "Acreditación INACAL", value: "INACAL" },
                        { label: "Acreditación NAC", value: "NAC" },
                        { label: "Sin acreditación", value: "SIN_ACREDITACION" },
                    ]}
                    optionLabel="label"
                    optionValue="value"
                    value={form.tipoPlantilla}
                    setForm={setForm}
                />
            </div>

            <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();
                    addFiles(event.dataTransfer.files);
                }}
                className="mx-3 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 text-center shadow-inner transition-all hover:border-emerald-500 hover:shadow-lg"
            >
                <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(event) => {
                        addFiles(event.target.files);
                        event.target.value = "";
                    }}
                    className="hidden"
                />
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-4xl text-emerald-500 shadow-xl">
                    <i className="pi pi-cloud-upload" />
                </div>
                <span className="mt-5 text-2xl font-bold text-slate-700">Arrastra o selecciona uno o varios archivos</span>
                <span className="mt-2 max-w-2xl text-sm font-semibold text-slate-500">
                    Antes de cargar, podrás revisar, corregir o eliminar cada informe detectado. Nada entra a Mongo hasta que confirmes.
                </span>
            </label>

            {files.length > 0 && (
                <div className="mx-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
                    <div className="flex items-center justify-between bg-slate-50 px-5 py-3">
                        <span className="font-bold text-slate-700">Previsualización de carga</span>
                        <span className="text-sm font-semibold text-emerald-600">{files.length} archivo(s)</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px] text-sm">
                            <thead className="bg-gray-100 text-left text-blue-900">
                                <tr>
                                    <th className="px-4 py-3">Archivo</th>
                                    <th className="px-4 py-3">Código</th>
                                    <th className="px-4 py-3">Plan de Monitoreo</th>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3">Matriz</th>
                                    <th className="px-4 py-3 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((item) => (
                                    <tr key={item.id} className="border-t border-slate-100">
                                        <td
                                            className="max-w-72 truncate px-4 py-3 font-semibold text-slate-600"
                                            data-pr-tooltip={item.file.name}
                                            data-pr-position="top"
                                        >
                                            {item.file.name}
                                        </td>
                                        {["codigo", "planMonitoreo", "cliente", "matriz"].map((field) => (
                                            <td key={field} className="px-4 py-3">
                                                <input
                                                    value={item[field] || ""}
                                                    onChange={(event) => updateFile(item.id, field, event.target.value)}
                                                    className={`w-full rounded-lg border px-3 py-2 font-semibold outline-none focus:border-emerald-400 ${item[field] ? "border-slate-200 text-slate-700" : "border-red-200 bg-red-50 text-red-600"}`}
                                                />
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                className="rounded-full bg-white px-3 py-2 text-red-500 shadow-lg transition-all hover:-translate-y-0.5"
                                                onClick={() => removeFile(item.id)}
                                                data-pr-tooltip="Quitar de la carga"
                                                data-pr-position="top"
                                            >
                                                <i className="pi pi-trash" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DatosGenerales;
