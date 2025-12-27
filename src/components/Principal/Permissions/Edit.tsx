import useref from "../../Otros/useRef";
import ButtonOk from "../../Ui/Button/Buttons";

const Edit = ({ setShowEdit, upDate, children }) => {
  const ref = useref(setShowEdit);
  const enviar = async () => {
    await upDate();
  }
  return (
    <div
      ref={ref}
      className={`w-[90%]  h-[93%] bg-white  flex flex-col justify-center
    border-gray-100 border shadow-2xl fixed top-5 z-40 rounded-xl `}
    >
      <div className=" flex flex-col h-[90%] space-y-4 p-2 overflow-y-auto">
        {children}
      </div>

      <div className="flex justify-end border-t border-gray-200">
        <ButtonOk onClick={enviar} type="ok" classe="w-32" children="Editar" />
        <ButtonOk
          type="cancel"
          onClick={() => setShowEdit(false)}
          classe="w-32"
          children="Cancelar"
        />
      </div>
    </div>
  );
};

export default Edit;
