import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LeftSideBar = ({ options, handleSubmit, show }) => {
    const sortSubModules = options.submodule?.sort();
    const [mostrar, setMostrar] = useState(false);

    useEffect(() => {
        setMostrar(show);
    }, [show]);
    return (
        <div
            className={`flex pt-8 p-4 flex-col items-start 
    shadow-[0px_0px_3px_rgba(0,0,0,0.25)] shadow-green-900 
    absolute z-50   bg-linear-to-b from-[#7BCF9E] to-[#3B8359]
     w-80 left-24  h-screen top-0 transition-all duration-500 ${mostrar
                    ? "opacity-100 translate-x-0 visible"
                    : "opacity-0 -translate-x-4 invisible"
                }`}
        >
            <span className="pl-4 text-3xl py-4 text-white font-bold">
                {options?.module}
            </span>
            {sortSubModules?.map((op, i) => {
                return (
                    <Link
                        key={i}
                        to={`/${options.module.toLowerCase()}/${op.toLowerCase()}`}
                        onClick={handleSubmit}
                        className="p-3 transition-all  text-base font-semibold pl-8 flex items-start w-full justify-start
  text-white hover:bg-slate-200 hover:text-black rounded-lg  "
                    >
                        <ul className="list-none">
                            <li className="list-none items-center ">{op}</li>
                        </ul>
                    </Link>
                );
            })}
        </div>
    );
};

export default LeftSideBar;
