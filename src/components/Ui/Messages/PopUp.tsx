import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { setMessage } from "../../../redux/actionError";

const PopUp = ({ deshabilitar, ...OtherProps }) => {
    const { setResponse, setErrors } = useAuth();
    const [showPopUp, setShowPopUp] = useState(false);
    const errorForms = useSelector((state) => state?.errorAndResponse);
    const dispatch = useDispatch();
    const handleClosePopUp = () => {
        dispatch(setMessage("", ""));
        setShowPopUp(false);
        if (setResponse) setResponse(null);
        if (setErrors) setErrors(null);
    };
    useEffect(() => {
        if (errorForms?.message) {
            setShowPopUp(true);
        } else {
            setShowPopUp(false);
        }
    }, [errorForms]);

    const colorClasses = {
        Error: {
            border: "border-red-300",
            text: "text-red-500",
            background: "bg-red-500",
            shadow: "shadow-red-100",
        },
        Correcto: {
            border: "border-green-300",
            text: "text-green-500",
            background: "bg-green-500",
            shadow: "shadow-green-100",
        },
        Info: {
            border: "border-blue-300",
            text: "text-blue-500",
            background: "bg-blue-500",
            shadow: "shadow-blue-100",
        },
    };
    const styles = colorClasses[errorForms?.type] ?? colorClasses.Info;

    return (
        showPopUp && (
            <div
                className="fixed top-0 z-100 left-0 right-0 bottom-0 flex 
    justify-center items-center bg-[rgba(0,0,0,0.2)] "
            >
                <div className={`flex flex-col justify-center w-[20%]! min-h-[25%]! bg-white  p-8 relative border-white border-4 rounded-lg shadow-sm ${styles.shadow}`}>
                    <div className="flex justify-center items-center ">
                        <div className={`flex justify-center  border mb-4 ${styles.border} ${styles.background} p-2 rounded-full items-center`}>
                            {errorForms?.type === "Error" ? (
                                <svg className={`w-16 h-16 text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : errorForms?.type === "Correcto" ? (
                                <svg className={`w-16 h-16 text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className={`w-16 h-16 text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <h1 className={`text-center font-medium pt-5 text-6xl ${styles.text}`}>
                        {errorForms?.type}
                    </h1>
                    <p className="text-center mb-6 mt-4 font-medium">
                        {typeof errorForms?.message === "string"
                            ? errorForms?.message
                            : "Error desconocido"}
                    </p>
                    {deshabilitar === true ? null : (
                        <div className="flex justify-center items-center absolute -top-4 -right-4">
                            <button
                                onClick={handleClosePopUp}
                                title="Cerrar"
                                {...OtherProps}
                                className=" rounded-full font-medium text-xl border border-gray-200 shadow-lg bg-gray-200 transition-all hover:bg-gray-300 w-12 h-12"
                            >
                                x
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default PopUp;
