import { useState } from "react";

type Errors<T> = {
    [K in keyof T]?: boolean;
};

const REQUIRED_FIELDS = [
    "tiempoDeEntrega",
    "tipoDeServicio",
    "proyecto_id",
    "analisis",
    "gastosOperativos",
    "gastosAdministrativos",
    "gastosGenerales",
    "totalSinIgv",
    "igv",
    "totalConIgv",
] as const;

const isEmpty = (value: any): boolean => {
    // null o undefined → vacío
    if (value === null || value === undefined) return true;

    // string vacío o solo espacios
    if (typeof value === "string") {
        return value.trim() === "";
    }

    // array vacío
    if (Array.isArray(value)) {
        return value.length === 0;
    }

    // objeto vacío
    if (typeof value === "object") {
        return Object.keys(value).length === 0;
    }

    // number y boolean → válidos (0 y false NO son error)
    return false;
};

export const useValidation = <T extends Record<string, any>>() => {
    const [errors, setErrors] = useState<Errors<T>>({});

    const validateForm = (form: T): boolean => {
        const newErrors: Errors<T> = {};

        REQUIRED_FIELDS.forEach((field) => {
            if (isEmpty(form[field])) {
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
