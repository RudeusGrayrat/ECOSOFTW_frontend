import { useState } from "react";
import LeftSideBar from "./LeftSideBar";
import useref from "../Otros/useRef";

const OptionSideBar = ({ icon, options, module }) => {
    const [mostrar, setMostrar] = useState(false);
    const ref = useref(setMostrar);

    const handleSubmit = () => {
        setMostrar(!mostrar);
    };

    return (
        <div
            ref={ref}
            className=" flex justify-center  m-2 my-8 bg-white  rounded-full"
        >
            {mostrar && (
                <LeftSideBar
                    show={mostrar}
                    handleSubmit={handleSubmit}
                    options={options}
                />
            )}
            <button
                className="p-[7px] boder w-17 cursor-pointer active:shadow-inner border-gray-200 shadow-lg shadow-gray-500 m-[5px]
        bg-linear-to-tr from-white to-gray-300 rounded-full"
                title={module}
                onClick={handleSubmit}
            >
                {icon}
            </button>
        </div>
    );
};

export default OptionSideBar;
