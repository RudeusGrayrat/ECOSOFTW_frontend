import { useState, useRef, useEffect } from "react";

const MoreOptions = (props) => {
    const { content, children } = props;

    const ref = useRef(null);
    const [mostrar, setMostrar] = useState(false);

    const handleSubmit = (response) => {
        setMostrar(!response);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setMostrar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={` bg-slate-200 flex justify-center items-center w-16 m-4 h-16 rounded-full`}
        >
            <button onClick={() => handleSubmit(mostrar)}>{content}</button>
            {mostrar && (
                <div
                    className={`bg-white shadow-sm z-50 shadow-cyan-500/50 fixed top-[74px]  p-3 px-8 rounded`}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default MoreOptions;
