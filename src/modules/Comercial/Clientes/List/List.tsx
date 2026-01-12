
import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import EditCliente from "../Permissions/Edit";
import ViewCliente from "../Permissions/View";
import ApproveCliente from "../Permissions/Approve";
import DisapproveCliente from "../Permissions/Disapprove";

const ListClientesComercial = ({
    permissionEdit,
    permissionRead,
    permissionApprove,
    permissionDisapprove,
    permissionDelete
}) => {

    const fetchClientesComercial = async (page, limit, search) => {
        const response = await axios.get("/comercial/getClientesPaginacion", {
            params: {
                page,
                limit,
                search,
            },
        })
        console.log({
            "reponse clientes comercial":
                response.data?.data
        })
        return {
            data: response.data?.data,
            total: response.data?.total,
        };
    };
    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            permissionDelete={permissionDelete}
            EditItem={EditCliente}
            DetailItem={ViewCliente}
            ApproveItem={ApproveCliente}
            DisapproveItem={DisapproveCliente}
            title={"cliente_comercial"}
            fetchData={fetchClientesComercial}
        >
            <Column
                field="tipoCliente"
                header="Tipo de Cliente"
                style={{ paddingLeft: "60px" }}
            ></Column>
            <Column
                field="cliente"
                header="Cliente"
            ></Column>
            <Column
                field="numeroDocumento"
                header="N° Documento"
            ></Column>
            <Column
                field="telefono"
                header="Teléfono"
            ></Column>
            <Column
                field="correoElectronico"
                header="Correo"
            ></Column>
            <Column
                field="estado"
                header="Estado"
                style={{
                    justifyItems: "center",
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
            ></Column>

        </ListPrincipal>
    );
};

export default ListClientesComercial;
