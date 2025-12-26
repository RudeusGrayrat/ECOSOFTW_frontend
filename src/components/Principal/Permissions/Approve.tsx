import useref from "../../Otros/useRef";
import ButtonOk from "../../Ui/Button/Buttons";
import PopUp from "../../Ui/Messages/PopUp";

const Approve = ({ setShowApprove, onclick, deshabilitar }) => {
  const ref = useref(setShowApprove);

  return (
    <div
      ref={ref}
      className="fixed top-0 z-40 left-0 right-0 bottom-0 flex justify-center items-center"
    >
      <PopUp deshabilitar={deshabilitar} />
      <div className="flex flex-col bg-white p-8 border-2 border-gray-200 rounded-lg shadow-lg">
        <div>
          <h1 className="p-4 font-bold text-red-600 text-center text-5xl">
            Atención !
          </h1>
          <h1 className="p-4 text-center text-xl">
            ¿Estás seguro de querer aprobar?
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <ButtonOk
            onClick={onclick}
            type="ok"
            styles={"!w-full m-4 flex justify-center mx-4"}
            classe={"!w-24"}
            children="SI"
          />
          <ButtonOk
            type="cancel"
            onClick={() => setShowApprove(false)}
            styles={"!w-full m-4 flex justify-center mx-4"}
            classe={"!w-24"}
            children="NO"
          />
        </div>
      </div>
    </div>
  );
};

export default Approve;
