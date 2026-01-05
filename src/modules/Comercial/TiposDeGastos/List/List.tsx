import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ApproveTiposDeGastos from "../Permissions/Approve";
import DisapproveTiposDeGastos from "../Permissions/Disapprove";
import EditTiposDeGastos from "../Permissions/Edit";

const ListTiposDeGastos = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
    permissionApprove,
    permissionDisapprove
}) => {
    const fetchData = async (limit, page, search) => {
        const response = await axios.get("/comercial/getTiposDeGastosPaginacion", {
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
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            ApproveItem={ApproveTiposDeGastos}
            DisapproveItem={DisapproveTiposDeGastos}
            EditItem={EditTiposDeGastos}
            title={"comercial_tipos_de_gastos"}
            fetchData={fetchData}
        >
            <Column field="tipoDeGasto" header="Tipo de Gasto" style={{ paddingLeft: "60px" }} />
            <Column field="descripcion" header="Descripción" />
            <Column field="precio" header="Precio Soles" />
            <Column field="estado" header="Estado"
                style={{
                    justifyItems: "center",
                    // display: window.innerWidth <= 1250 ? "none" : "table-cell",
                }}
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

export default ListTiposDeGastos;