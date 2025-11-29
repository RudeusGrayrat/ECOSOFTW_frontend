import { useEffect, useState } from "react";
import ButtonOk from "../../Ui/Button/Buttons";
const isContentEmpty = (obj) => {
    // Si no es un objeto, es null, o es un Array, no lo filtramos.
    if (typeof obj !== "object" || obj === null || Array.isArray(obj))
        return false;

    // Aquí puedes hacer la verificación estricta de objeto literal vacío:
    if (Object.keys(obj).length === 0) return true;

    // Si tienes objetos anidados con sólo campos vacíos,
    // puedes usar una verificación más profunda, pero para tu caso {} es suficiente.
    return false;
};
const Directorio = (props) => {
    const { ItemComponent, setForm, directory, estilos, error, data } = props;

    const [formData, setFormData] = useState(
        directory ? directory.map((dir, index) => ({
            id: index + 1,
            initialData: dir,
        })) : [] // <-- ¡Cambiado a []!
    );
    const handleAddForm = () => {
        setFormData([...formData, { id: Date.now(), initialData: {} }]);
    };

    const handleRemoveForm = (id) => {
        setFormData(formData.filter((form) => form.id !== id));
    };

    const handleUpdateFormData = (id, newData) => {
        const updatedForms = formData.map((form) =>
            form.id === id
                ? { ...form, initialData: { ...form.initialData, ...newData } }
                : form
        );
        setFormData(updatedForms);
        setForm((prevEdition) => ({
            ...prevEdition,
            [data]: updatedForms.map((form) => form.initialData),
        }));
    };

    useEffect(() => {
        // Mapeamos los datos para obtener solo los 'initialData'
        const rawData = formData.map((form) => form.initialData);

        // ⭐️ FILTRAMOS LOS OBJETOS VACÍOS {} ⭐️
        const filteredData = rawData.filter((item) => !isContentEmpty(item));

        setForm((prevEdition) => ({
            ...prevEdition,
            [data]: filteredData, // <--- Enviamos los datos filtrados
        }));
    }, [formData, setForm, data]); // Asegúrate de incluir 'data' en las dependencias si no lo estaba
    return (
        <div>
            {formData.map((form) => (
                <div
                    key={form.id}
                    className={` ${estilos}  mb-4! border mt-2 border-slate-200 shadow-md rounded-xl py-3 w-full `}
                >
                    <ItemComponent
                        initialData={form.initialData}
                        set={(newData) => handleUpdateFormData(form.id, newData)}
                        error={error}
                        {...props}
                    />
                    <ButtonOk
                        classe="w-full"
                        styles={estilos ? "mt-5 px-6  mr-3" : "my-2 px-8 mr-3"}
                        onClick={() => handleRemoveForm(form.id)}
                        children="X"
                    />
                </div>
            ))}
            <div className=" items-center text-center w-full">

                <ButtonOk
                    type="ok"
                    children="Añadir"
                    classe="w-[70%] text-black! min-w-40 bg-linear-to-r from-[#DADCDD]! to-[#DADCDD]!
                    "
                    styles="mt-6 px-8 mx-4"
                    onClick={handleAddForm}
                />
            </div>
        </div>
    );
};

export default Directorio;
