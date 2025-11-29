import { useEffect, useMemo, useRef, useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";

const GastosOperativos = ({ initialData, set }) => {
    const [gastosOperativos, setGastosOperativos] = useState({
        descripcion: null,
        precio: 0,
        cantidad: 0,
        dias: 0,
        subtotal: 0,
    });

    const [gastosOperativosOptions, setGastosOperativosOptions] = useState([]);
    const lastSentPayloadRef = useRef(null);

    useEffect(() => {
        const gastoPrice = gastosOperativos.descripcion?.precio ?? null;

        if (gastoPrice === null) return;

        setGastosOperativos((prev) => {
            if (String(prev.precio) === String(gastoPrice)) return prev;
            return { ...prev, precio: gastoPrice };
        });
    }, [gastosOperativos.descripcion?.precio]);

    const subtotal = useMemo(() => {
        const p = parseFloat(gastosOperativos.precio || 0);
        const q = parseFloat(gastosOperativos.cantidad || 0);
        const d = parseFloat(gastosOperativos.dias || 0);
        const calc = Number.isFinite(p) && Number.isFinite(q) && Number.isFinite(d) ? p * q * d : 0;
        return Math.round((calc + Number.EPSILON) * 100) / 100; // 2 decimales
    }, [gastosOperativos.precio, gastosOperativos.cantidad, gastosOperativos.dias]);


    useEffect(() => {
        if (!gastosOperativos.descripcion) return;
        if (subtotal <= 0) return;
        const payload = {
            tipoDeGasto_id: gastosOperativos.descripcion?._id || null,
            descripcion: gastosOperativos.descripcion?.descripcion || gastosOperativos.descripcion,
            precio: gastosOperativos.precio,
            cantidad: gastosOperativos.cantidad,
            dias: gastosOperativos.dias,
            subtotal: subtotal,
        }
        const last = lastSentPayloadRef.current;
        const same =
            last &&
            last.tipoDeGasto_id === payload.tipoDeGasto_id &&
            String(last.precio) === String(payload.precio) &&
            String(last.cantidad) === String(payload.cantidad) &&
            String(last.dias) === String(payload.dias) &&
            String(last.subtotal) === String(payload.subtotal);
        if (!same) {
            try {
                set(payload);
                lastSentPayloadRef.current = payload;
            } catch (error) {
                console.error("Error setting payload:", error);
            }
        }
    }, [
        gastosOperativos.descripcion?._id,
        gastosOperativos.precio,
        gastosOperativos.cantidad,
        gastosOperativos.dias,
        gastosOperativos.subtotal,
        set,
    ]);

    return (
        <div className="flex flex-wrap justify-center items-center pt-2">
            <InputP
                label="Gasto Operativo"
                type="autocomplete"
                options={gastosOperativosOptions}
                name="descripcion"
                ancho={"w-96"}
                fetchData={"/comercial/getTiposDeGastosPaginacion"}
                setOptions={setGastosOperativosOptions}
                value={gastosOperativos.descripcion}
                setForm={setGastosOperativos}
            />

            <InputNormal
                label="Precio"
                type="number"
                name="precio"
                value={gastosOperativos.precio}
                setForm={setGastosOperativos}
            />
            <InputP
                label="Cantidad"
                type="number"
                name="cantidad"
                value={gastosOperativos.cantidad}
                setForm={setGastosOperativos}
            />
            <InputNormal
                label="Días"
                type="number"
                name="dias"
                value={gastosOperativos.dias}
                setForm={setGastosOperativos}
            />
            <InputNormal
                label="Subtotal"
                type="number"
                disabled={true}
                name="subtotal"
                value={gastosOperativos.precio * gastosOperativos.cantidad * gastosOperativos.dias}
                setForm={setGastosOperativos}
            />
        </div>
    )
}
export default GastosOperativos;