// src/utils/validation.js
import { useState } from "react";

const useValidation = (initialFormData) => {
  const [error, setError] = useState({
    module: false,
  });

  const validateForm = (formData) => {
    const newError = {
      module: formData.module === "",
    };

    // Validar si los campos dentro de los arreglos son vacíos o no
    setError(newError);

    const formIsValid = Object.values(newError).every(
      (field) =>
        field === false ||
        (typeof field === "object" &&
          Object.values(field).every((subfield) => subfield === false))
    );

    return formIsValid;
  };

  return { error, validateForm };
};

export default useValidation;
