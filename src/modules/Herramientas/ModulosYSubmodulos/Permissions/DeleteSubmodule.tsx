import { useDispatch } from "react-redux";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import { useAuth } from "../../../../context/AuthContext";
import { getSubModule } from "../../../../redux/Modulos/Herramientas/actions";
import Delete from "../../../../components/Principal/Permissions/Delete";


const DeleteSubmodule = ({ setShowDelete, selected }) => {
  const { deleteSubModule } = useAuth();
  const sendMessage = useSendMessage();
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      await deleteSubModule({ _id: selected._id });
      dispatch(getSubModule());
    } catch (error) {
      sendMessage(error.message, "Error");
    } finally {
    }
  };
  return <Delete setShowDelete={setShowDelete} onclick={handleDelete} />;
};

export default DeleteSubmodule;
