import { useEffect, useMemo, useRef, useState } from "react";
import InputP from "../../../../components/Ui/Input/InputP";
import InputNormal from "../../../../components/Ui/Input/Normal";

const GastosAdministrativos = ({ set, initialData }) => {
    const [gastosAdministrativos, setGastosAdministrativos] = useState({
        descripcion: null,
        precio: 0,
        cantidad: 0,
        subtotal: 0,
    });

    const [gastosAdministrativosOptions, setGastosAdministrativosOptions] = useState([]);

    const lastSentPayloadRef = useRef(null);

    useEffect(() => {
        const gasoPrice = gastosAdministrativos.descripcion?.precio ?? null;
        if (gasoPrice === null) return;
        setGastosAdministrativos((prev) => {
            if (String(prev.precio) === String(gasoPrice)) return prev;
            return { ...prev, precio: gasoPrice };
        });
    }, [gastosAdministrativos.descripcion?.precio]);

    const subtotal = useMemo(() => {
        const p = parseFloat(gastosAdministrativos.precio || 0);
        const q = parseFloat(gastosAdministrativos.cantidad || 0);
        const calc = Number.isFinite(p) && Number.isFinite(q) ? p * q : 0;
        return Math.round((calc + Number.EPSILON) * 100) / 100; // 2 decimales
    }, [gastosAdministrativos.precio, gastosAdministrativos.cantidad]);

    useEffect(() => {
        if (!gastosAdministrativos.descripcion) return;
        const payload = {
            tipoDeGasto_id: gastosAdministrativos.descripcion?._id,
            descripcion: gastosAdministrativos.descripcion?.descripcion || gastosAdministrativos.descripcion,
            precio: gastosAdministrativos.precio,
            cantidad: gastosAdministrativos.cantidad,
            subtotal: subtotal,
        }

        const last = lastSentPayloadRef.current;
        const same =
            last &&
            last.tipoDeGasto_id === payload.tipoDeGasto_id &&
            String(last.descripcion) === String(payload.descripcion) &&
            String(last.precio) === String(payload.precio) &&
            String(last.cantidad) === String(payload.cantidad) &&
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
        gastosAdministrativos.descripcion?._id,
        gastosAdministrativos.descripcion,
        gastosAdministrativos.precio,
        gastosAdministrativos.cantidad,
        gastosAdministrativos.subtotal,
        set,
    ]);

    return (
        <div className="flex flex-wrap justify-center items-center pt-2">
            <InputP
                label="Gasto Administrativo"
                type="autocomplete"
                options={gastosAdministrativosOptions}
                name="descripcion"
                ancho={"w-96"}
                fetchData={"/comercial/getTiposDeGastosPaginacion"}
                setOptions={setGastosAdministrativosOptions}
                value={gastosAdministrativos.descripcion}
                setForm={setGastosAdministrativos}
            />
            <InputNormal
                label="Precio"
                type="number"
                name="precio"
                value={gastosAdministrativos.precio}
                setForm={setGastosAdministrativos}
            />
            <InputP
                label="Cantidad"
                type="number"
                name="cantidad"
                value={gastosAdministrativos.cantidad}
                setForm={setGastosAdministrativos}
            />

            <InputP
                label="Subtotal"
                type="number"
                disabled={true}
                name="subtotal"
                value={gastosAdministrativos.precio * gastosAdministrativos.cantidad}
                setForm={setGastosAdministrativos}
            />
        </div>
    )
}

export default GastosAdministrativos;