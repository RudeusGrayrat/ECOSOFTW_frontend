import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";


const ListCotizacionesComercial = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
    permissionApprove,
    permissionDisapprove,
}) => {
    const fetchCotizacionesComercial = async (page: number, limit: number, search: string) => {
        const response = await axios.get("/comercial/getCotizacionesPaginacion", {
            params: {
                page,
                limit,
                search
            }
        });
        return {
            data: response?.data?.data || [],
            total: response?.data?.total,
        };

    };
    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            fetchData={fetchCotizacionesComercial}
            reload={fetchCotizacionesComercial}
            title={"comercial_cotizaciones"}
        >
            <Column
                field="tipoCliente"
                header="Tipo de Cliente"
                style={{ paddingLeft: "60px" }}
            ></Column>
            <Column
                field={
                    (rowData) =>
                        rowData.tipoCliente === "EMPRESA"
                            ? (rowData.rucEmpresa)
                            : (rowData.dniCliente)
                }
                header="RUC / DNI"
            ></Column>
            <Column
                field={
                    (rowData) =>
                        rowData.tipoCliente === "EMPRESA"
                            ? (rowData.razonSocial)
                            : (rowData.nombreCliente)
                }
                header="Razón Social / Nombre"
            ></Column>
            <Column
                field="servicio"
                header="Servicio"
            ></Column>

        </ListPrincipal>
    )
}

export default ListCotizacionesComercial;