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


    return (
        showPopUp && (
            <div
                className="fixed top-0 z-100 left-0 right-0 bottom-0 flex 
    justify-center items-center bg-[rgba(0,0,0,0.5)] "
            >
                <div className="flex flex-col  bg-white p-8  rounded-lg shadow-lg max-w-sm w-full">
                    <h1 className={`text-center font-medium pt-5 text-6xl ${errorForms?.type === "Correcto" && "text-green-500!"} ${errorForms?.type === "Error" && "text-red-500!"}  text-blue-500 `}>
                        {errorForms?.type}
                    </h1>
                    <p className="text-center mb-6 mt-4 font-medium">
                        {typeof errorForms?.message === "string"
                            ? errorForms?.message
                            : "Error desconocido"}
                    </p>
                    {deshabilitar === true ? null : (
                        <div className="flex justify-center items-center w-full">
                            <button
                                onClick={handleClosePopUp}
                                {...OtherProps}
                                className="text-white font-medium bg-blue-500 w-10/12 rounded-lg p-3  "
                            >
                                Ok
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default PopUp;
