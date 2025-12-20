
import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";

const ListClientesComercial = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
}) => {

    const fetchClientesComercial = async (page, limit, search) => {
        const response = await axios.get("/comercial/getClientesPaginacion", {
            params: {
                page,
                limit,
                search,
            },
        })
        console.log("response", response.data);
        return {
            data: response.data?.data,
            total: response.data?.total,
        };
    };
    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            fetchData={fetchClientesComercial}
            reload={fetchClientesComercial}
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
