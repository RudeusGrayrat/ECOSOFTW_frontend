import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ApproveUsuarios from "../Permissions/Approve";
import DisapproveUsuarios from "../Permissions/Disapprove";
import EditUsuarios from "../Permissions/Edit";
import ViewUsuarios from "../Permissions/View";

const ListUsuarios = ({
    permissionEdit,
    permissionRead,
    permissionApprove,
    permissionDisapprove
}) => {
    const fetchData = async (page, limit, search) => {
        const response = await axios.get("/herramientas/getUsuariosPaginacion", {
            params: { limit, page, search }
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
            ApproveItem={ApproveUsuarios}
            DisapproveItem={DisapproveUsuarios}
            EditItem={EditUsuarios}
            DetailItem={ViewUsuarios}
            title={"herramientas_usuarios"}
            fetchData={fetchData}
        >
            <Column field="userName" header="Usuario" style={{ paddingLeft: "60px" }} />
            <Column field="colaborador" header="Colaborador" />
            <Column field="correoElectronico" header="Correo" />
            <Column field="puesto" header="Puesto" />
            <Column field="estado" header="Estado"
                style={{ justifyItems: "center" }}
                body={(rowData) => {
                    const color = rowData.estado === "ACTIVO" ? " text-green-500 " : " text-red-500 ";
                    return (
                        <div className={`text-center bg-linear-to-tr from-white to-gray-100 shadow-inner rounded-xl font-semibold px-5 py-1 ${color}`}>
                            {rowData.estado}
                        </div>
                    );
                }}
            />
        </ListPrincipal>
    )
}

export default ListUsuarios;
