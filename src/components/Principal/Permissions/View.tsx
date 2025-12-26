import { useLocation, useNavigate } from "react-router-dom";
import ButtonOk from "../../Ui/Button/Buttons";

const Details = (props) => {
  const { setShowDetail, children } = props;
  const navigate = useNavigate();
  const location = useLocation();

  // const detailsRef = useref(setShowDetail);
  const handleCloseDetail = () => {
    setShowDetail(false);

    const params = new URLSearchParams(location.search);
    params.delete("view");
    params.delete("edit");

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div
      // ref={detailsRef}
      className={`w-[88%] h-[83%] bg-white flex flex-col justify-center
         border-gray-100 border shadow-2xl fixed top-20 z-50 rounded-xl`}
    >
      <div className="flex justify-center h-[88%]">
        <div className="w-[97%] h-[97%]">
          <div className="p-10 m-5 h-full overflow-y-auto bg-gradient-to-tr from-gray-50 to-gray-100 rounded-lg shadow-lg ">
            {children}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-3">
        <ButtonOk classe={"w-40!"} type="cancel" onClick={handleCloseDetail} children="Cerrar" />
      </div>
    </div>
  );
};

export default Details;
