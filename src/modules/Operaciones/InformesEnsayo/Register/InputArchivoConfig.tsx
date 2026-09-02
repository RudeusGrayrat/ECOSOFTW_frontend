type InputArchivoConfigProps = {
    label: string;
    accept: string;
    currentFile?: string;
    selectedFile?: File | null;
    disabled?: boolean;
    onSelect: (file: File | null) => void;
    onUpload: () => void;
    onDelete?: () => void;
};

const InputArchivoConfig = ({
    label,
    accept,
    currentFile,
    selectedFile,
    disabled = false,
    onSelect,
    onUpload,
    onDelete,
}: InputArchivoConfigProps) => {
    const fileName = selectedFile?.name || currentFile || "";
    const hasFile = Boolean(fileName);

    return (
        <div className="flex min-h-24 flex-col mx-3">
            <label className="text-base font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex flex-wrap items-center gap-3">
                {!hasFile && (
                    <label className="flex w-72 cursor-pointer items-center justify-center gap-3 rounded-md border-2 border-dashed border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700">
                        <i className="pi pi-plus" />
                        Nuevo archivo
                        <input
                            type="file"
                            accept={accept}
                            className="hidden"
                            disabled={disabled}
                            onChange={(event) => onSelect(event.target.files?.[0] || null)}
                        />
                    </label>
                )}

                {hasFile && (
                    <div className="flex w-80 items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm">
                        <div className="flex min-w-0 items-center gap-2">
                            <i className="pi pi-file text-emerald-600" />
                            <span className="truncate font-semibold text-slate-600" title={fileName}>
                                {fileName}
                            </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                            <label className={`pi pi-pencil ${disabled ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-blue-500"}`}>
                                <input
                                    type="file"
                                    accept={accept}
                                    className="hidden"
                                    disabled={disabled}
                                    onChange={(event) => onSelect(event.target.files?.[0] || null)}
                                />
                            </label>
                            {onDelete && (
                                <button
                                    type="button"
                                    className="pi pi-trash border-none bg-transparent text-red-500 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300"
                                    disabled={disabled}
                                    onClick={onDelete}
                                    title="Eliminar archivo"
                                />
                            )}
                        </div>
                    </div>
                )}

                {selectedFile && (
                    <button
                        type="button"
                        className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        disabled={disabled}
                        onClick={onUpload}
                    >
                        Actualizar
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputArchivoConfig;
