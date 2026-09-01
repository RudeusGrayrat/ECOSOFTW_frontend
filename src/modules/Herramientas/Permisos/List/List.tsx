import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ApprovePermisos from "../Permissions/Approve";
import DisapprovePermisos from "../Permissions/Disapprove";
import EditPermisos from "../Permissions/Edit";
import ViewPermisos from "../Permissions/View";

const ListPermisos = ({
    permissionEdit,
    permissionRead,
    permissionApprove,
    permissionDisapprove
}) => {
    const fetchData = async (page, limit, search) => {
        const response = await axios.get("/herramientas/getPermissionsPaginacion", {
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
            permissionEdit={permissionEdit}
            permissionDelete={false}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            ApproveItem={ApprovePermisos}
            DisapproveItem={DisapprovePermisos}
            EditItem={EditPermisos}
            DetailItem={ViewPermisos}
            title={"herramientas_permisos"}
            fetchData={fetchData}
        >
            <Column field="name" header="Permiso" style={{ paddingLeft: "60px" }} />
            <Column field="description" header="Descripción" />
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
    )
}

export default ListPermisos;
