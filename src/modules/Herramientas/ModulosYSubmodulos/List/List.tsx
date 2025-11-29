import { Column } from "primereact/column";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubModule } from "../../../../redux/Modulos/Herramientas/actions";
import ListPrincipal from "../../../../components/Principal/List/List";
import DeleteSubmodule from "../Permissions/DeleteSubmodule";


const List = ({ permissionEdit, permissionDelete }) => {
  const subModules = [{}]
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (subModules.length === 0) {
  //     dispatch(getSubModule());
  //   }
  // }, [dispatch, subModules.length]);
  return (
    <ListPrincipal
      permissionDelete={permissionDelete}
      permissionEdit={permissionEdit}
      DeleteItem={DeleteSubmodule}
      content={subModules}
    >
      <Column
        field="module"
        header="Modulo"
        sortable
        style={{ paddingLeft: "60px" }}
      />
      <Column field="name" header="Submodulo" sortable />
    </ListPrincipal>
  );
};

export default List;
