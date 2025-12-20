import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import PhoneInput from "react-phone-number-input";
import { MultiSelect } from "primereact/multiselect";
import "react-phone-number-input/style.css";
import "./stilos.css";
import "primeicons/primeicons.css";
import { AutoComplete } from "primereact/autocomplete";
import axios from "../../../api/axios";

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
    mayus = true,
    fetchData,
    setOptions,
    otro = true,
    extraParams = {},
    ...OtherProps
}) => {
    if (setForm === undefined) {
        setForm = () => { };
    }
    const [error, setErrorState] = useState(false);
    const [animation, setAnimation] = useState(false);
    const [otroMode, setOtroMode] = useState(false);
    const [otroValor, setOtroValor] = useState("");

    const styleError = "border-red-500 animate-shake";
    const styleNormal = "border-gray-300!";
    const styleConstant =
        "mt-1 px-3 py-2 border min-w-56 text-base! rounded-md! shadow-sm sm:text-sm focus:outline-none! focus:ring-emerald-500! focus:border-emerald-500! bg-white ";

    const estilo = `${styleConstant} ${ancho} ${animation ? styleError : styleNormal
        }`;
    const clase = `border mt-1! px-1! py-0! rounded-lg min-w-[250px] ${estilo} ${ancho} `;

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

        if (name === "email" || name === "correoElectronico" || name === "username" || name === "correo") {
            newValue = value.toLowerCase();
        } else if (name === "password" || name === "permissions") {
            newValue = value;
        } else if (type === "autocomplete") {
            newValue = value;
        } else if (typeof value === "object") {
            newValue = value;
        } else {
            newValue = mayus ? value.toUpperCase() : value;
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
    const debounceRef = useRef(null);
    switch (type) {
        case "multiSelect":
            content = (
                <MultiSelect
                    className={estilo + " py-0!"}
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
        case "autocomplete":
            let opcionesConOtro = [];
            if (otro) {
                opcionesConOtro = [
                    ...OtherProps?.options,
                    { [name]: "OTRO", value: "OTRO" }
                ];
            } else {
                opcionesConOtro = [...OtherProps?.options];
            }


            content = (
                <div className="flex items-center gap-2">
                    {!otroMode ? (
                        <AutoComplete
                            value={value}
                            suggestions={opcionesConOtro}
                            completeMethod={(e) => {
                                clearTimeout(debounceRef.current);

                                debounceRef.current = setTimeout(() => {
                                    if (e.query === "OTRO") return;
                                    let allParams = {
                                        page: 0,
                                        limit: 10,
                                        search: e.query,
                                    }
                                    if (OtherProps.extraParams) {
                                        allParams = {
                                            ...allParams,
                                            ...extraParams
                                        }
                                    }
                                    axios
                                        .get(fetchData, {
                                            params: allParams
                                        })
                                        .then((res) => setOptions(res.data.data));
                                }, 500);
                            }}
                            field={name}
                            placeholder={label}
                            dropdown
                            className={estilo + " p-0!"}
                            onChange={(e) => {
                                if (e.value?.value === "OTRO") {
                                    setOtroMode(true);
                                    setForm((prev) => ({ ...prev, [name]: "" }));
                                } else {
                                    handleChange(e);
                                }
                            }}
                            {...OtherProps}
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className={estilo}
                                value={otroValor}
                                placeholder="Ingrese otro valor..."
                                onChange={(e) => {
                                    const upper = mayus ? e.target.value.toUpperCase() : e.target.value;

                                    setOtroValor(upper);
                                    setForm((prev) => ({ ...prev, [name]: upper }));
                                }}

                            />
                            <button
                                type="button"
                                className="px-2 py-1 bg-red-500 text-white rounded-full"
                                onClick={() => {
                                    setOtroMode(false);
                                    setOtroValor("");
                                    setForm((prev) => ({ ...prev, [name]: "" }));
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            );
            break;

        case "select":
            content = (
                <Dropdown
                    className={estilo + " py-0!"}
                    value={value}
                    onChange={handleChange}
                    options={OtherProps.options}
                    placeholder={label}
                    editable={OtherProps.editable || true}
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
        <div className="flex flex-col mx-3 F h-20" title={OtherProps.title || ""}>
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
