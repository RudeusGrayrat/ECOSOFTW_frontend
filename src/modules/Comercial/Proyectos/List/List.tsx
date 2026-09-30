import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import EditProyectos from "../Permissions/Edit";
import ViewProyectos from "../Permissions/View";
import ApproveProyectos from "../Permissions/Approve";
import DisapproveProyecto from "../Permissions/Disapprove";
import DeleteProyecto from "../Permissions/Delete";

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
            DeleteItem={DeleteProyecto}
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
                    const statusStyle: Record<string, string> = {
                        ACTIVO: "border-emerald-200 bg-emerald-50 text-emerald-700",
                        INACTIVO: "border-red-200 bg-red-50 text-red-700",
                        // Visibles durante la migración para que ningún valor
                        // histórico parezca un estado válido o quede gris.
                        PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
                        COTIZADO: "border-sky-200 bg-sky-50 text-sky-700",
                        APROBADO: "border-emerald-200 bg-emerald-50 text-emerald-700",
                        ANULADO: "border-red-200 bg-red-50 text-red-700",
                    };
                    const color = statusStyle[rowData.estado] || "border-slate-200 bg-slate-50 text-slate-600";

                    return (
                        <div
                            className={`rounded-xl border px-5 py-1 text-center font-semibold shadow-inner ${color}`}
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
