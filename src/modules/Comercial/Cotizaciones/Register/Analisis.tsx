import React, { useEffect, useMemo, useRef, useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";

/**
 * Analisis component corregido y optimizado
 * Props:
 *  - set(payload)  -> función para enviar el payload al padre
 *  - initialData   -> (opcional) datos iniciales
 */
const Analisis = ({ set, initialData }) => {
    const [analisisDeCotizacion, setAnalisisDeCotizacion] = useState({
        parametro: null, // guarda el objeto parámetro completo o null
        precio: "",      // valor editable (puede venir del parametro)
        cantidad: 0,
    });

    // opciones del autocomplete
    const [parametrosOptions, setParametrosOptions] = useState([]);

    // ref para recordar el último payload enviado y no reenviarlo si no cambió
    const lastSentPayloadRef = useRef(null);

    // -- Sincronizar precio cuando cambia el parámetro seleccionado --
    // Actualizamos el precio en el estado SOLO si el nuevo precio es distinto.
    useEffect(() => {
        const paramPrice = analisisDeCotizacion.parametro?.precio ?? null;

        // si no hay parametro, no tocar el precio (se mantiene lo que el usuario haya puesto)
        if (paramPrice === null) return;

        setAnalisisDeCotizacion((prev) => {
            // evita setState si es el mismo precio (evita renders extra)
            if (String(prev.precio) === String(paramPrice)) return prev;
            return { ...prev, precio: paramPrice };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analisisDeCotizacion.parametro?.precio]);
    // Observa: dependemos de propiedades estables del parámetro (id, precio),
    // no del objeto entero para reducir re-ejecuciones.

    // -- Subtotal derivado (no guardado en state) --
    const subtotal = useMemo(() => {
        const p = parseFloat(analisisDeCotizacion.precio || 0);
        const q = parseFloat(analisisDeCotizacion.cantidad || 0);
        const calc = Number.isFinite(p) && Number.isFinite(q) ? p * q : 0;
        return Math.round((calc + Number.EPSILON) * 100) / 100; // 2 decimales
    }, [analisisDeCotizacion.precio, analisisDeCotizacion.cantidad]);

    // -- Construir y enviar payload al padre solo si hay cambios reales --
    useEffect(() => {
        // Solo enviamos si hay un parametro seleccionado (evita envíos prematuros)
        if (!analisisDeCotizacion.parametro) return;
        if (subtotal <= 0) return; // si subtotal 0 no enviamos

        const payload = {
            parametro_id: analisisDeCotizacion.parametro._id,
            precio: analisisDeCotizacion.precio,
            cantidad: analisisDeCotizacion.cantidad,
            subtotal: subtotal,
            descripcion: analisisDeCotizacion.parametro?.tipoDeAnalisis ?? null,
        };

        // compara con el último enviado para evitar reenvíos innecesarios
        const last = lastSentPayloadRef.current;
        const same =
            last &&
            last.parametro_id === payload.parametro_id &&
            String(last.precio) === String(payload.precio) &&
            String(last.cantidad) === String(payload.cantidad) &&
            String(last.subtotal) === String(payload.subtotal) &&
            last.tipoDeAnalisis === payload.tipoDeAnalisis

        if (!same) {
            // manda al padre
            try {
                set(payload);
                lastSentPayloadRef.current = payload;
            } catch (err) {
                console.warn("Error al ejecutar set(payload):", err);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // dependencias: solo valores primitivos/estables que determinan el payload
        analisisDeCotizacion.parametro?.id,
        analisisDeCotizacion.parametro?.tipoDeAnalisis,
        analisisDeCotizacion.precio,
        analisisDeCotizacion.cantidad,
        subtotal,
        set, // asumimos que set es estable; si no lo es, el padre debería memoizarlo
    ]);

    return (
        <div className="flex flex-wrap justify-center items-center pt-2">
            <InputP
                label="Tipo de Análisis"
                type="text"
                name="tipoDeAnalisis"
                disabled={true}
                value={analisisDeCotizacion.parametro?.tipoDeAnalisis ?? ""}
            />

            {analisisDeCotizacion.parametro?.tipoDeAnalisis === "AGUA" && (
                <InputP
                    label="Categoría"
                    name="categoria"
                    disabled={true}
                    value={analisisDeCotizacion.parametro?.categoria}
                />
            )}

            <InputP
                label="Parámetro"
                type="autocomplete"
                name="parametro"
                ancho={"w-96"}
                value={analisisDeCotizacion.parametro}
                options={parametrosOptions}
                fetchData={"/comercial/getParametrosPaginacion"} // InputP usa axios.get(fetchData, ...)
                setOptions={setParametrosOptions}
                setForm={setAnalisisDeCotizacion}
            />

            <InputP
                label="Metodología y Referencia"
                disabled={true}
                type="text"
                name="metodo"
                value={analisisDeCotizacion.parametro?.metodo ?? ""}
            />

            <InputP
                label="Acreditación"
                type="text"
                disabled={true}
                name="acreditacion"
                ancho={"min-w-30! w-36"}
                value={analisisDeCotizacion.parametro?.acreditadoPor ?? ""}
            />

            <InputP
                label="L.C.M"
                title="Límite de Cuantificación del Medio"
                ancho={"min-w-20! w-20"}
                disabled={true}
                type="text"
                onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) e.preventDefault();
                }}
                name="limiteDeCuantificacionDelMetodo"
                value={analisisDeCotizacion.parametro?.limiteDeCuantificacionDelMetodo ?? ""}
            />

            <InputP
                label="L.D.M"
                title="Límite de Detección del Medio"
                disabled={true}
                ancho={"min-w-20! w-20"}
                type="text"
                onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) e.preventDefault();
                }}
                name="limiteDeDeteccionDelMetodo"
                value={analisisDeCotizacion.parametro?.limiteDeDeteccionDelMetodo ?? ""}
            />

            <InputP
                label="Unidad de Medida"
                name="unidadDeMedida"
                disabled={true}
                mayus={false}
                ancho={"min-w-30!"}
                value={analisisDeCotizacion.parametro?.unidadDeMedida ?? ""}
            />

            <InputP
                label="Precio"
                type="text"
                onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) e.preventDefault();
                }}
                name="precio"
                ancho={"min-w-20! w-36"}
                value={analisisDeCotizacion.precio}
                setForm={setAnalisisDeCotizacion}
            />

            <InputP
                label="Cantidad"
                type="text"
                onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) e.preventDefault();
                }}
                name="cantidad"
                ancho={"min-w-20! w-36"}
                value={analisisDeCotizacion.cantidad}
                setForm={setAnalisisDeCotizacion}
            />

            <InputP
                label="Subtotal"
                type="number"
                disabled={true}
                name="subtotal"
                value={subtotal}
            // no enviamos setForm porque está deshabilitado; InputP en tu implementación lo manejará
            />
        </div>
    );
};

export default Analisis;
