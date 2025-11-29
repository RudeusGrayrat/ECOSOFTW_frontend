import { Link } from "react-router-dom";
import OptionSideBar from "./OptionsSideBar";
import useModulesAndSubModules from "./Links";

const SideBar = () => {
    const { links: userOptions } = useModulesAndSubModules();

    return (
        <div
            className="  shadow-[1px_0px_4px_rgba(0,0,0,0.25)] shadow-green-900  bg-linear-to-b from-[#7BCF9E] to-[#3B8359]  z-50 items-center  flex flex-col 
         w-25 h-min-screen  h-full "
        >
            <div className=" w-[77px]  flex shadow-md justify-center items-center h-[77px] my-8 rounded-full">
                <Link to={"/home"}>
                    <img
                        src="/ISOTIPO_LOGO.svg"
                        width={77}
                        height={77}
                        alt="LOGO "
                    />
                </Link>
            </div>
            <div
                style={{
                    scrollBehavior: "smooth",
                    overflowY: "auto",
                    height: "87vh",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {userOptions.length > 0 && userOptions[0].module !== ""
                    ? userOptions?.map((options, index) => {
                        return (
                            <OptionSideBar
                                key={index}
                                icon={
                                    <img
                                        src={`/${options.module}.svg`}
                                        alt="icon"
                                        width={66}
                                        height={66}
                                    />
                                }
                                options={options}
                                module={options.module}
                            />
                        )
                    })
                    : null}
            </div>
        </div>
    );
};

export default SideBar;
