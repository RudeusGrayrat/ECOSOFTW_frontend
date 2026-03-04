import React, { useEffect, useMemo, useRef, useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";

const Analisis = ({ set, initialData }) => {
    console.log("Initial Data in Analisis:", initialData);
    const [analisisDeCotizacion, setAnalisisDeCotizacion] = useState({
        tipoDeAnalisis: initialData.parametro_id?.tipoDeAnalisis || "",
        parametro: initialData.parametro_id || null,
        precio: initialData.precio || "",
        cantidad: initialData.cantidad || 0,
        subtotal: initialData.subtotal || 0,
    });

    // opciones del autocomplete
    const [parametrosOptions, setParametrosOptions] = useState([]);

    useMemo(() => {
        const p = parseFloat(analisisDeCotizacion.precio || "0");
        const q = parseFloat(analisisDeCotizacion.cantidad || "0");
        const calc = Number.isFinite(p) && Number.isFinite(q) ? p * q : 0;
        const final = Math.round((calc + Number.EPSILON) * 100) / 100; // 2 decimales
        setAnalisisDeCotizacion((prev) => ({ ...prev, subtotal: final }));
        return final;
    }, [analisisDeCotizacion.precio, analisisDeCotizacion.cantidad]);

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


    useEffect(() => {
        const payload = {
            descripcion: analisisDeCotizacion.tipoDeAnalisis || "",
            parametro_id: analisisDeCotizacion.parametro?._id || null,
            cantidad: analisisDeCotizacion.cantidad,
            precio: analisisDeCotizacion.precio,
            subtotal: analisisDeCotizacion.subtotal,
        };
        set(payload);
    }, [analisisDeCotizacion.cantidad, analisisDeCotizacion.precio, analisisDeCotizacion.parametro, analisisDeCotizacion.tipoDeAnalisis, []]);
    return (
        <div className="flex flex-wrap justify-center items-center pt-2">
            <InputP
                label="Tipo de Análisis"
                type="select"
                name="tipoDeAnalisis"
                options={[
                    "AGUA",
                    "AIRE",
                    "SUELO",
                    "RUIDO",
                    "EMISIONES",
                    "MONITOREO OCUPACIONAL"
                ]}
                value={analisisDeCotizacion.tipoDeAnalisis}
                setForm={setAnalisisDeCotizacion}
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
                fetchData={`/comercial/getParametrosPaginacion?tipoDeAnalisis=${analisisDeCotizacion?.tipoDeAnalisis}`} // ajusta el endpoint según tu backend
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
                value={analisisDeCotizacion.subtotal}
            // no enviamos setForm porque está deshabilitado; InputP en tu implementación lo manejará
            />
        </div>
    );
};

export default Analisis;
