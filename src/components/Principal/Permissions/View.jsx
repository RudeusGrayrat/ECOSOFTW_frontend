import ButtonOk from "../../../recicle/Buttons/Buttons";
import PopUp from "../../../recicle/popUps";
import { useLocation, useNavigate } from "react-router-dom";
const Details = (props) => {
  const { setShowDetail, children } = props;
  const navigate = useNavigate();
  const location = useLocation();

  // const detailsRef = useref(setShowDetail);
  const handleCloseDetail = () => {
    setShowDetail(false);
    navigate(location.pathname);
  };

  return (
    <div
      // ref={detailsRef}
      className={`w-[88%] h-[83%] bg-white flex flex-col justify-center
         border-gray-100 border shadow-2xl fixed top-20 z-50 rounded-xl`}
    >
      <PopUp />
      <div className="flex justify-center h-[88%]">
        <div className="w-[97%] h-[97%]">
          <div className="p-10 m-5 h-full overflow-y-auto bg-gradient-to-tr from-gray-50 to-gray-100 rounded-lg shadow-lg ">
            {children}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-3">
        <ButtonOk onClick={handleCloseDetail} children="Cerrar" />
      </div>
    </div>
  );
};

export default Details;
