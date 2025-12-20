import { useState } from "react";

type Errors<T> = {
    [K in keyof T]?: boolean;
};

const REQUIRED_FIELDS = [
    "tipoCliente",
    "cliente",
    "numeroDocumento",
    "telefono",
    "direccionLegal",
    "correoElectronico",
    "servicio",
    "proyecto",
    "cantidadPuntosParametros",
    "lugarMuestreo",
    "fechaServicio",
] as const;

// ⚠️ nombreContacto NO está aquí → no es obligatorio

export const useValidation = <T extends Record<string, any>>() => {
    const [errors, setErrors] = useState<Errors<T>>({});

    const validateForm = (form: T): boolean => {
        const newErrors: Errors<T> = {};

        REQUIRED_FIELDS.forEach((field) => {
            if (!form[field] || String(form[field]).trim() === "") {
                newErrors[field as keyof T] = true;
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return {
        errors,
        validateForm,
    };
};
