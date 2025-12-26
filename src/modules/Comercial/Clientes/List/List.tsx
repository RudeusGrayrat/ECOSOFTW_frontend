
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
}) => {

    const fetchClientesComercial = async (page, limit, search) => {
        const response = await axios.get("/comercial/getClientesPaginacion", {
            params: {
                page,
                limit,
                search,
            },
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

        </ListPrincipal>
    );
};

export default ListClientesComercial;
