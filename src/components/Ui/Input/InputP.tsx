import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import PhoneInput from "react-phone-number-input";
import { MultiSelect } from "primereact/multiselect";
import "react-phone-number-input/style.css";
import "./stilos.css";
import "primeicons/primeicons.css";

const InputP = ({
    prueba,
    setForm,
    label,
    type,
    name,
    errorOnclick,
    value,
    setError,
    ancho,
    ...OtherProps
}) => {
    const [error, setErrorState] = useState(false);
    const [animation, setAnimation] = useState(false);
    const styleError = "border-red-500 animate-shake";
    const styleNormal = "!border-gray-300";
    const styleConstant =
        "mt-1 px-3 py-2 border min-w-56 !text-base !rounded-md shadow-sm sm:text-sm !focus:outline-none !focus:ring-indigo-500 !focus:border-indigo-500";
    console.log("Style Constant: ", styleConstant);

    const estilo = `${styleConstant} ${ancho} ${animation ? styleError : styleNormal
        }`;
    const clase = `border !mt-1 !px-1 !py-0 rounded-lg min-w-[250px] ${estilo} ${ancho} `;

    const handleAnimation = () => {
        setAnimation(true);
    };
    useEffect(() => {
        if (errorOnclick) {
            handleAnimation();
            setErrorState(true);
        } else {
            setAnimation(false);
            setErrorState(false);
        }
    }, [errorOnclick]);
    useEffect(() => {
        if (value) {
            if (type === "multiSelect") {
                setForm(value);
            } else {
                setForm((prev) => ({ ...prev, [name]: value }));
            }
            setErrorState(false);
            setAnimation(false);
        }
    }, [value]);

    const handleChange = (e) => {
        const { value } = e.target;
        let newValue = value;
        if (name === "email") {
            newValue = value.toLowerCase();
        } else if (name === "password" || name === "permissions") {
            newValue = value;
        } else {
            newValue = value.toUpperCase();
        }
        if (type === "multiSelect") {
            setForm(e.value);
        } else {
            setForm((prev) => ({ ...prev, [name]: newValue }));
        }
        if (value) {
            setErrorState(false);
            setAnimation(false);
        } else {
            setErrorState(true);
            handleAnimation();
        }
    };

    const handleBlur = () => {
        if (!value) {
            setErrorState(true);
            handleAnimation();
        }
    };

    let content;
    switch (type) {
        case "multiSelect":
            content = (
                <MultiSelect
                    className={estilo}
                    value={value}
                    maxSelectedLabels={OtherProps.max ? OtherProps.max : 4}
                    onChange={handleChange}
                    options={OtherProps.options}
                    display="chip"
                    placeholder="Seleccione una opción"
                />
            );
            break;
        case "phone":
            content = (
                <PhoneInput
                    value={value}
                    onChange={handleChange}
                    className={clase}
                    placeholder={label}
                />
            );
            break;
        case "password":
            content = (
                <Password
                    toggleMask
                    value={value}
                    onChange={handleChange}
                    placeholder={label}
                    className={estilo}
                />
            );
            break;
        case "select":
            content = (
                <Dropdown
                    className={estilo}
                    value={value}
                    onChange={handleChange}
                    options={OtherProps.options}
                    placeholder={label}
                    editable
                    {...OtherProps}
                />
            );
            break;
        default:
            content = (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    autoComplete="off"
                    placeholder={error ? "Este campo es obligatorio" : label}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    {...OtherProps}
                    className={estilo}
                />
            );
    }

    return (
        <div className="flex flex-col mx-3 F h-20">
            <label
                className={`text-base font-medium ${error ? "text-red-500" : "text-gray-700"
                    }`}
            >
                {error ? label + " *" : label}
            </label>
            {content}
        </div>
    );
};

export default InputP;
