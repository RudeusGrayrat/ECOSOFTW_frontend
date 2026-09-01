import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ViewModulosYSubmodulos from "../Permissions/View";
import EditModulosYSubmodulos from "../Permissions/Edit";
import ApproveModulosYSubmodulos from "../Permissions/Approve";
import DisapproveModulosYSubmodulos from "../Permissions/Disapprove";


const List = ({
  permissionEdit,
  permissionRead,
  permissionApprove,
  permissionDisapprove
}) => {
  const fetchData = async (page, limit, search) => {
    const response = await axios.get("/herramientas/getModulosYSubmodulosPaginacion", {
      params: {
        limit,
        page,
        search
      }
    });
    return {
      data: response.data.data,
      total: response.data.total
    }
  }

  return (
    <ListPrincipal
      permissionRead={permissionRead}
      permissionDelete={false}
      permissionEdit={permissionEdit}
      permissionApprove={permissionApprove}
      permissionDisapprove={permissionDisapprove}
      DetailItem={ViewModulosYSubmodulos}
      EditItem={EditModulosYSubmodulos}
      ApproveItem={ApproveModulosYSubmodulos}
      DisapproveItem={DisapproveModulosYSubmodulos}
      title={"herramientas_modulos_y_submodulos"}
      fetchData={fetchData}
    >
      <Column field="tipo" header="Tipo" style={{ paddingLeft: "60px" }} />
      <Column
        field="module"
        header="Modulo"
        sortable
      />
      <Column field="name" header="Submodulo" sortable />
      <Column field="order" header="Orden" />
      <Column field="estado" header="Estado"
        style={{ justifyItems: "center" }}
        body={(rowData) => {
          const color =
            rowData.estado === "ACTIVO"
              ? " text-green-500 "
              : " text-red-500 ";

          return (
            <div
              className={`text-center bg-linear-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {rowData.estado}
            </div>
          );
        }}
      />
    </ListPrincipal>
  );
};

export default List;
