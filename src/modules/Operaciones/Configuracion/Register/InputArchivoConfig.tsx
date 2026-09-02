import { Button } from "primereact/button";

const InputArchivoConfig = ({
    label,
    accept,
    currentFile,
    selectedFile,
    disabled,
    onSelect,
    onUpload,
    onDelete,
}) => {
    const fileName = selectedFile?.name || currentFile || "Sin archivo configurado";

    return (
        <div className="mx-3 flex min-w-80 flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg">
            <label className="text-base font-bold text-slate-700">{label}</label>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3">
                <span className={`max-w-72 truncate text-sm font-semibold ${currentFile || selectedFile ? "text-slate-700" : "text-slate-400"}`}>
                    {fileName}
                </span>
                <div className="flex items-center gap-2">
                    <label className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white text-blue-500 shadow-lg transition-all hover:-translate-y-0.5 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
                        <input
                            type="file"
                            accept={accept}
                            disabled={disabled}
                            onChange={(event) => onSelect(event.target.files?.[0] || null)}
                            className="hidden"
                        />
                        <i className="pi pi-pencil" />
                    </label>
                    <Button
                        icon="pi pi-upload"
                        title="Actualizar archivo"
                        rounded
                        outlined
                        disabled={disabled || !selectedFile}
                        className="h-10! w-10! rounded-full! bg-white! text-emerald-600! shadow-lg!"
                        onClick={onUpload}
                    />
                    <Button
                        icon="pi pi-trash"
                        title="Eliminar archivo"
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
