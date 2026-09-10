import { Button } from "primereact/button";
import axios from "../../../../api/axios";

const InputArchivoConfig = ({
    label,
    accept,
    currentFile,
    selectedFile,
    disabled,
    downloadUrl,
    onSelect,
    onUpload,
    onDelete,
}) => {
    const fileName = selectedFile?.name || currentFile || "Sin archivo configurado";
    const hasCurrentFile = Boolean(currentFile);

    const downloadFile = async () => {
        if (!downloadUrl || !currentFile) return;
        const response = await axios.get(downloadUrl, { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = currentFile;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="mx-3 flex min-w-80 flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg">
            <label className="text-base font-bold text-slate-700">{label}</label>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3">
                <div className="min-w-0">
                    <span className={`block max-w-72 truncate text-sm font-semibold ${currentFile || selectedFile ? "text-slate-700" : "text-slate-400"}`}>
                        {fileName}
                    </span>
                    {selectedFile && (
                        <span className="mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-emerald-600">
                            Pendiente de guardar
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasCurrentFile && (
                        <Button
                            icon="pi pi-download"
                            data-pr-tooltip="Descargar archivo actual"
                            data-pr-position="top"
                            rounded
                            outlined
                            disabled={disabled}
                            className="h-10! w-10! rounded-full! bg-white! text-sky-500! shadow-lg!"
                            onClick={downloadFile}
                        />
                    )}
                    <label
                        className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white text-blue-500 shadow-lg transition-all hover:-translate-y-0.5 ${disabled ? "pointer-events-none opacity-50" : ""}`}
                        data-pr-tooltip={currentFile ? "Seleccionar reemplazo" : "Seleccionar archivo"}
                        data-pr-position="top"
                    >
                        <input
                            type="file"
                            accept={accept}
                            disabled={disabled}
                            onChange={(event) => onSelect(event.target.files?.[0] || null)}
                            className="hidden"
                        />
                        <i className="pi pi-pencil" />
                    </label>
                    {selectedFile && (
                        <Button
                            icon="pi pi-check"
                            data-pr-tooltip="Guardar archivo seleccionado"
                            data-pr-position="top"
                            rounded
                            outlined
                            disabled={disabled}
                            className="h-10! w-10! rounded-full! bg-white! text-emerald-600! shadow-lg!"
                            onClick={onUpload}
                        />
                    )}
                    <Button
                        icon="pi pi-trash"
                        data-pr-tooltip="Eliminar archivo"
                        data-pr-position="top"
                        rounded
                        outlined
                        disabled={disabled || (!currentFile && !selectedFile)}
                        className="h-10! w-10! rounded-full! bg-white! text-red-500! shadow-lg!"
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div>
    )
}

export default InputArchivoConfig;
