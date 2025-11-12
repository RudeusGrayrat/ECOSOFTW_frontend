import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/actionError";

const useSendMessage = () => {
  const dispatch = useDispatch();

  return (message, type) => {
    dispatch(setMessage(message, type));
  };
};

export default useSendMessage;
