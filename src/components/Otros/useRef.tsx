import { useEffect, useRef } from "react";
const useref = (setShow) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                const excludeElements = document.querySelectorAll(
                    // PrimeReact monta AutoComplete y algunos paneles en un portal
                    // fuera del modal. Esos clics siguen siendo parte de la edición.
                    '.p-dropdown-panel, .p-multiselect-panel, .p-autocomplete-panel, .p-datepicker, .MuiPickersPopper-root'
                );

                let clickedInsideExclusion = false;

                excludeElements.forEach((element) => {
                    if (element.contains(e.target)) {
                        clickedInsideExclusion = true;
                    }
                });

                if (!clickedInsideExclusion) {
                    setShow(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShow]);

    return ref;
};

export default useref;
