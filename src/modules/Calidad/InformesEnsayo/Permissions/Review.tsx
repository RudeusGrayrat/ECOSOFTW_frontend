import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import PopUp from "../../../../components/Ui/Messages/PopUp";
import "./Review.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const tools = [
    { type: "COMENTARIO", label: "Comentario", icon: "pi pi-comment", color: "#22C55E" },
    { type: "RESALTADO", label: "Resaltado", icon: "pi pi-stop", color: "#B7F000" },
    { type: "MARCO", label: "Marco", icon: "pi pi-clone", color: "#22C55E" },
    { type: "FLECHA", label: "Flecha", icon: "pi pi-arrow-right", color: "#16A34A" },
];

const colorOptions = [
    { label: "Lima", value: "#B7F000" },
    { label: "Verde", value: "#22C55E" },
    { label: "Amarillo", value: "#FACC15" },
    { label: "Naranja", value: "#FB923C" },
    { label: "Rojo", value: "#EF4444" },
    { label: "Azul", value: "#38BDF8" },
];

const defaultTextByType = {
    COMENTARIO: "Nueva observación",
    RESALTADO: "",
    MARCO: "",
    FLECHA: "",
};

const clamp = (value) => Math.min(1, Math.max(0, value));

const ReviewInformesEnsayo = ({ rowData, reload, permissionRead, permissionApprove }) => {
    const [showPanel, setShowPanel] = useState(false);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [annotations, setAnnotations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [tool, setTool] = useState("COMENTARIO");
    const [drawing, setDrawing] = useState(null);
    const [moving, setMoving] = useState(null);
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const renderTaskRef = useRef(null);
    const sendMessage = useSendMessage();

    const currentAnnotations = annotations.filter((item) => Number(item.pagina) === pageNumber);
    const selectedAnnotation = annotations.find((item) => item.uid === selectedId);
    const canOpenReview = (permissionRead || permissionApprove) && !rowData?.papelera;
    const canManageReview = permissionApprove && !rowData?.papelera && !["PRELIMINAR", "LIBERADO", "DISPONIBLE"].includes(rowData?.estado);
    const isDraft = rowData?.estado === "BORRADOR";
    const isObserved = rowData?.estado === "OBSERVADO";
    const hasObservations = annotations.length > 0;
    const canSaveReview = canManageReview && isObserved && hasObservations && !deshabilitar;
    const canObserveReview = canManageReview && isDraft && hasObservations && !deshabilitar;
    const canApproveReview = canManageReview && isDraft && !hasObservations && !deshabilitar;

    const relativePoint = (event) => {
        const rect = overlayRef.current.getBoundingClientRect();
        return {
            x: clamp((event.clientX - rect.left) / rect.width),
            y: clamp((event.clientY - rect.top) / rect.height),
        };
    };

    const loadReview = async () => {
        setDeshabilitar(true);
        try {
            const [pdfResponse, obsResponse] = await Promise.all([
                axios.get(`/calidad/informes-ensayo/${rowData._id}/archivo`, { responseType: "arraybuffer" }),
                axios.get(`/calidad/informes-ensayo/${rowData._id}/observaciones`, { params: { version: rowData.versionActual } }),
            ]);
            const pdf = await pdfjsLib.getDocument({ data: pdfResponse.data }).promise;
            setPdfDoc(pdf);
            setNumPages(pdf.numPages);
            setPageNumber(1);
            setAnnotations(obsResponse.data?.observaciones || []);
            setSelectedId(null);
        } catch (error) {
            sendMessage(error, "Error");
            setShowPanel(false);
        } finally {
            setDeshabilitar(false);
        }
    };

    useEffect(() => {
        if (showPanel) loadReview();
    }, [showPanel]);

    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return;
        let cancelled = false;

        const renderPage = async () => {
            const page = await pdfDoc.getPage(pageNumber);
            const baseViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(1.35, 860 / baseViewport.width);
            const viewport = page.getViewport({ scale });
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            renderTaskRef.current?.cancel?.();
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            setPageSize({ width: viewport.width, height: viewport.height });

            const task = page.render({ canvasContext: context, viewport });
            renderTaskRef.current = task;
            try {
                await task.promise;
            } catch (error) {
                if (!cancelled && error?.name !== "RenderingCancelledException") sendMessage(error, "Error");
            }
        };

        renderPage();
        return () => {
            cancelled = true;
            renderTaskRef.current?.cancel?.();
        };
    }, [pdfDoc, pageNumber]);

    const startDraw = (event) => {
        if (!overlayRef.current || !canManageReview) return;
        const point = relativePoint(event);

        if (tool === "COMENTARIO") {
            const annotation = {
                uid: crypto.randomUUID(),
                version: rowData.versionActual,
                pagina: pageNumber,
                tipo: "COMENTARIO",
                texto: defaultTextByType.COMENTARIO,
                color: tools.find((item) => item.type === "COMENTARIO")?.color || "#22C55E",
                x: point.x,
                y: point.y,
                width: 0.22,
                height: 0.08,
            };
            setAnnotations((prev) => [...prev, annotation]);
            setSelectedId(annotation.uid);
            return;
        }

        setDrawing({
            uid: crypto.randomUUID(),
            version: rowData.versionActual,
            pagina: pageNumber,
            tipo: tool,
            texto: defaultTextByType[tool],
            color: tools.find((item) => item.type === tool)?.color || "#B7F000",
            x: point.x,
            y: point.y,
            width: 0,
            height: 0,
            x2: point.x,
            y2: point.y,
        });
    };

    const movePointer = (event) => {
        if (!canManageReview) return;
        if (moving) {
            const point = relativePoint(event);
            setAnnotations((prev) => prev.map((item) => {
                if (item.uid !== moving.uid) return item;
                const nextX = clamp(point.x - moving.offsetX);
                const nextY = clamp(point.y - moving.offsetY);
                if (item.tipo === "FLECHA") {
                    const dx = (item.x2 || item.x) - item.x;
                    const dy = (item.y2 || item.y) - item.y;
                    return { ...item, x: nextX, y: nextY, x2: clamp(nextX + dx), y2: clamp(nextY + dy) };
                }
                return { ...item, x: nextX, y: nextY };
            }));
            return;
        }

        if (!drawing) return;
        const point = relativePoint(event);
        if (drawing.tipo === "FLECHA") {
            setDrawing((prev) => ({ ...prev, x2: point.x, y2: point.y }));
            return;
        }
        setDrawing((prev) => ({
            ...prev,
            width: Math.abs(point.x - prev.x),
            height: Math.abs(point.y - prev.y),
            x: Math.min(point.x, prev.x),
            y: Math.min(point.y, prev.y),
        }));
    };

    const finishDraw = () => {
        if (moving) {
            setMoving(null);
            return;
        }
        if (!drawing) return;
        const enoughSize = drawing.tipo === "FLECHA"
            ? Math.abs((drawing.x2 || 0) - drawing.x) > 0.015 || Math.abs((drawing.y2 || 0) - drawing.y) > 0.015
            : drawing.width > 0.015 && drawing.height > 0.01;

        if (enoughSize) {
            setAnnotations((prev) => [...prev, drawing]);
            setSelectedId(drawing.uid);
        }
        setDrawing(null);
    };

    const startMove = (event, annotation) => {
        event.stopPropagation();
        if (!canManageReview) {
            setSelectedId(annotation.uid);
            return;
        }
        const point = relativePoint(event);
        setSelectedId(annotation.uid);
        setMoving({
            uid: annotation.uid,
            offsetX: point.x - annotation.x,
            offsetY: point.y - annotation.y,
        });
    };

    const updateSelected = (changes) => {
        if (!canManageReview) return;
        setAnnotations((prev) => prev.map((item) => item.uid === selectedId ? { ...item, ...changes } : item));
    };

    const removeSelected = () => {
        if (!canManageReview) return;
        setAnnotations((prev) => prev.filter((item) => item.uid !== selectedId));
        setSelectedId(null);
    };

    const saveLayer = async () => {
        setDeshabilitar(true);
        try {
            const response = await axios.post(`/calidad/informes-ensayo/${rowData._id}/observaciones`, {
                version: rowData.versionActual,
                observaciones: annotations,
            });
            sendMessage(response.data.message, response.data.type || "Correcto");
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const observeReport = async () => {
        if (!annotations.length) {
            sendMessage("Agrega al menos una observación antes de marcar el informe como observado.", "Error");
            return;
        }
        setDeshabilitar(true);
        try {
            const response = await axios.post(`/calidad/informes-ensayo/${rowData._id}/observar`, {
                version: rowData.versionActual,
                observaciones: annotations,
            });
            sendMessage(response.data.message, response.data.type || "Correcto");
            setShowPanel(false);
            await reload?.();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const approveReport = async () => {
        if (annotations.length) {
            sendMessage("Si existen observaciones, usa Observar. Para aprobar, elimina primero la capa de observaciones.", "Error");
            return;
        }
        setDeshabilitar(true);
        try {
            const response = await axios.post(`/calidad/informes-ensayo/${rowData._id}/aprobar`);
            sendMessage(response.data.message, response.data.type || "Correcto");
            setShowPanel(false);
            await reload?.();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const annotationStyle = (annotation) => {
        if (annotation.tipo === "FLECHA") {
            const dx = ((annotation.x2 || annotation.x) - annotation.x) * pageSize.width;
            const dy = ((annotation.y2 || annotation.y) - annotation.y) * pageSize.height;
            return {
                left: `${annotation.x * 100}%`,
                top: `${annotation.y * 100}%`,
                width: `${Math.max(20, Math.sqrt(dx * dx + dy * dy))}px`,
                transform: `rotate(${Math.atan2(dy, dx)}rad)`,
            };
        }
        return {
            left: `${annotation.x * 100}%`,
            top: `${annotation.y * 100}%`,
            width: `${Math.max(annotation.width * 100, annotation.tipo === "COMENTARIO" ? 18 : 2)}%`,
            height: `${Math.max(annotation.height * 100, annotation.tipo === "COMENTARIO" ? 7 : 1.5)}%`,
        };
    };

    const annotationVisualStyle = (annotation) => ({
        ...annotationStyle(annotation),
        "--annotation-color": annotation.color,
    });

    const renderAnnotation = (annotation, ghost = false) => (
        <div
            key={annotation.uid}
            className={`review-annotation ${selectedId === annotation.uid ? "is-selected" : ""} ${
                annotation.tipo === "COMENTARIO"
                    ? "review-annotation-comment"
                    : annotation.tipo === "RESALTADO"
                        ? "review-annotation-highlight"
                        : annotation.tipo === "MARCO"
                            ? "review-annotation-frame"
                            : "review-annotation-arrow"
            }`}
            style={annotationVisualStyle(annotation)}
            onMouseDown={(event) => !ghost && startMove(event, annotation)}
        >
            {annotation.tipo === "COMENTARIO" ? annotation.texto : ""}
        </div>
    );

    if (!permissionRead && !permissionApprove) return null;

    return (
        <>
            <Button
                icon="pi pi-search"
                data-pr-tooltip={canManageReview ? "Revisar informe" : canOpenReview ? "Ver observaciones" : "No tienes acceso a la revisión"}
                data-pr-position="top"
                rounded
                outlined
                disabled={!canOpenReview}
                className={`text-lime-600! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out shadow-xl ${!canOpenReview ? "cursor-not-allowed opacity-30" : ""}`}
                onClick={() => setShowPanel(true)}
            />

            {showPanel && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4"
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <PopUp deshabilitar={deshabilitar} />
                    <div className="relative h-[92vh] w-[96vw] max-w-[1500px]">
                        <button
                            type="button"
                            className="review-close-button"
                            data-pr-tooltip="Cerrar revisión"
                            data-pr-position="left"
                            disabled={deshabilitar}
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowPanel(false);
                            }}
                        >
                            <i className="pi pi-times" />
                        </button>

                    <section className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl">
                        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4 pr-16">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">Revisión de informe</p>
                                <h2 className="text-2xl font-black text-slate-800">{rowData.codigo} · {rowData.planMonitoreo || "SIN PM"}</h2>
                                {!canManageReview && (
                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        Modo lectura: puedes ver las observaciones, pero no modificarlas.
                                    </p>
                                )}
                            </div>
                            <div className={`flex flex-wrap items-center gap-2 ${!canManageReview ? "pointer-events-none opacity-45" : ""}`}>
                                {tools.map((item) => (
                                    <button
                                        key={item.type}
                                        type="button"
                                        className={`review-overlay-tool rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 shadow-md ${tool === item.type ? "is-active" : ""}`}
                                        data-pr-tooltip={item.label}
                                        data-pr-position="bottom"
                                        onClick={() => setTool(item.type)}
                                    >
                                        <i className={item.icon} /> {item.label}
                                    </button>
                                ))}
                            </div>
                        </header>

                        <div className="grid min-h-0 flex-1 grid-cols-[1fr_360px]">
                            <div className="review-pdf-shell min-h-0 overflow-auto p-5">
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <Button
                                        icon="pi pi-chevron-left"
                                        rounded
                                        outlined
                                        disabled={pageNumber <= 1}
                                        onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                                    />
                                    <span className="rounded-full bg-white px-5 py-2 text-sm font-black text-slate-700 shadow">
                                        Página {pageNumber} de {numPages || "-"}
                                    </span>
                                    <Button
                                        icon="pi pi-chevron-right"
                                        rounded
                                        outlined
                                        disabled={!numPages || pageNumber >= numPages}
                                        onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                                    />
                                </div>

                                <div className="mx-auto w-fit rounded-xl bg-white p-3 shadow-2xl">
                                    <div
                                        className="relative"
                                        style={{ width: pageSize.width, height: pageSize.height }}
                                    >
                                        <canvas ref={canvasRef} className="block" />
                                        <div
                                            ref={overlayRef}
                                            className="review-page-layer absolute inset-0"
                                            onMouseDown={startDraw}
                                            onMouseMove={movePointer}
                                            onMouseUp={finishDraw}
                                            onMouseLeave={finishDraw}
                                        >
                                            {currentAnnotations.map((annotation) => renderAnnotation(annotation))}
                                            {drawing ? renderAnnotation(drawing, true) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <aside className="flex min-h-0 flex-col border-l border-slate-100 bg-slate-50/70 p-5">
                                <div className="mb-4">
                                    <h3 className="text-xl font-black text-slate-800">Observaciones</h3>
                                    <p className="text-sm font-semibold text-slate-500">
                                        {currentAnnotations.length} en esta página · {annotations.length} total
                                    </p>
                                </div>

                                {selectedAnnotation ? (
                                    <div className="relative mb-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow">
                                        {canManageReview && (
                                            <button
                                                type="button"
                                                className="review-delete-annotation -top-3! -right-1! p-5!"
                                                data-pr-tooltip="Eliminar observación"
                                                data-pr-position="left"
                                                onClick={removeSelected}
                                            >
                                                <i className="pi text-xl! pi-trash" />
                                            </button>
                                        )}
                                        <p className="mb-2 pr-10 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{selectedAnnotation.tipo}</p>
                                        <textarea
                                            value={selectedAnnotation.texto || ""}
                                            rows={4}
                                            placeholder="Describe la observación..."
                                            readOnly={!canManageReview}
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-400 read-only:bg-slate-50 read-only:text-slate-500"
                                            onChange={(event) => updateSelected({ texto: event.target.value })}
                                        />
                                        {canManageReview && (
                                            <div className="review-color-card mt-2">
                                                <span className="review-color-title">Color</span>
                                                {colorOptions.map((item) => (
                                                    <button
                                                        key={item.value}
                                                        type="button"
                                                        className={`review-color-dot ${selectedAnnotation.color === item.value ? "is-active" : ""}`}
                                                        style={{ backgroundColor: item.value }}
                                                        data-pr-tooltip={item.label}
                                                        data-pr-position="top"
                                                        onClick={() => updateSelected({ color: item.value })}
                                                    />
                                                ))}
                                                <label
                                                    className="review-color-custom"
                                                    data-pr-tooltip="Color personalizado"
                                                    data-pr-position="top"
                                                    >
                                                        <i className="pi pi-palette" />
                                                        <input
                                                        type="color"
                                                        value={selectedAnnotation.color || "#B7F000"}
                                                        onChange={(event) => updateSelected({ color: event.target.value })}
                                                        />
                                                    </label>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mb-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-slate-500">
                                        Selecciona una observación o dibuja una nueva sobre el PDF.
                                    </div>
                                )}

                                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                                    {currentAnnotations.map((item) => (
                                        <button
                                            key={item.uid}
                                            type="button"
                                            className={`w-full rounded-2xl border bg-white p-3 text-left text-sm shadow-sm transition hover:-translate-y-0.5 ${selectedId === item.uid ? "border-emerald-400" : "border-slate-100"}`}
                                            onClick={() => setSelectedId(item.uid)}
                                        >
                                            <span className="font-black text-slate-700">{item.tipo}</span>
                                            <p className="mt-1 line-clamp-2 font-semibold text-slate-500">{item.texto || "Sin comentario adicional"}</p>
                                        </button>
                                    ))}
                                </div>

                                <footer className="mt-5 border-t border-slate-200 pt-4">
                                    <p className="mb-3 text-xs font-semibold text-slate-500">
                                        {canManageReview
                                            ? "En borrador: aprueba si no hay marcas u observa si agregaste comentarios. Guardar solo sirve para actualizar observaciones de un informe ya observado."
                                            : "Modo lectura: las observaciones se muestran por página para que Calidad pueda corregir y subir una nueva versión."}
                                    </p>
                                    {canManageReview && <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="review-review-action text-sky-600"
                                            disabled={!canSaveReview}
                                            data-pr-tooltip={isObserved ? "Guardar cambios en observaciones" : "Guardar solo aplica cuando ya está observado"}
                                            data-pr-position="top"
                                            onClick={saveLayer}
                                        >
                                            <i className="pi pi-save" />
                                        </button>
                                        <button
                                            type="button"
                                            className="review-review-action text-orange-500"
                                            disabled={!canObserveReview}
                                            data-pr-tooltip={hasObservations ? "Marcar borrador como observado" : "Agrega observaciones para observar"}
                                            data-pr-position="top"
                                            onClick={observeReport}
                                        >
                                            <i className="pi pi-exclamation-triangle" />
                                        </button>
                                        <button
                                            type="button"
                                            className="review-review-action text-emerald-600"
                                            disabled={!canApproveReview}
                                            data-pr-tooltip={hasObservations ? "No se aprueba con observaciones activas" : "Aprobar borrador"}
                                            data-pr-position="top"
                                            onClick={approveReport}
                                        >
                                            <i className="pi pi-check" />
                                        </button>
                                    </div>}
                                </footer>
                            </aside>
                        </div>
                    </section>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReviewInformesEnsayo;
