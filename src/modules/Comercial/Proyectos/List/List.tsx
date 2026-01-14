import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import EditProyectos from "../Permissions/Edit";
import ViewProyectos from "../Permissions/View";
import ApproveProyectos from "../Permissions/Approve";
import DisapproveProyecto from "../Permissions/Disapprove";

const ListProyectos = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
    permissionApprove,
    permissionDisapprove
}) => {
    const fetchData = async (limit: Number, page: Number, search: String) => {
        const response = await axios.get("/comercial/getProyectosPaginacion", {
            params: {
                limit,
                page,
                search,
            },
        });
        return {
            data: response.data?.data,
            total: response.data?.total
        }
    }
    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            EditItem={EditProyectos}
            DetailItem={ViewProyectos}
            ApproveItem={ApproveProyectos}
            DisapproveItem={DisapproveProyecto}
            fetchData={fetchData}
            title={"comercial_proyectos"}
        >
            <Column field="cliente_id.tipoCliente" header="Tipo de Cliente"
                style={{ paddingLeft: "60px" }}
            ></Column>
            <Column field="nombre" header="Proyecto"></Column>
            <Column field="cliente_id.numeroDocumento" header="RUC / DNI"></Column>
            <Column field="cliente_id.cliente" header="Cliente"></Column>
            <Column field="servicio" header="Servicio"></Column>
            <Column field="fechaServicio" header="Fecha de Servicio"></Column>
            <Column field="estado" header="Estado"
                style={{
                    justifyItems: "center",
                }}
                body={(rowData) => {
                    let color = "text-gray-500";
                    if (rowData.estado === "APROBADO") {
                        color = "text-green-500";
                    } else if (rowData.estado === "ANULADO") {
                        color = "text-red-500";
                    } else if (rowData.estado === "PENDIENTE") {
                        color = "text-orange-500";
                    } else if (rowData.estado === "COTIZADO") {
                        color = "text-blue-500";
                    }

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
export default ListProyectos;