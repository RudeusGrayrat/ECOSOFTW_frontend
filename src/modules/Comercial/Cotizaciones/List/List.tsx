import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import axios from "../../../../api/axios";
import ViewCotizacion from "../Permissions/View";
import ApproveCotizacion from "../Permissions/Approve";
import DisapproveCotizacion from "../Permissions/Disapprove";
import EditCotizacion from "../Permissions/Edit";


const ListCotizacionesComercial = ({
    permissionEdit,
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
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            DetailItem={ViewCotizacion}
            ApproveItem={ApproveCotizacion}
            DisapproveItem={DisapproveCotizacion}
            EditItem={EditCotizacion}
            fetchData={fetchCotizacionesComercial}
            title={"comercial_cotizaciones"}
        >
            <Column
                field="correlativa"
                header="N° Cotización"
                style={{ paddingLeft: "60px" }}
            ></Column>
            <Column
                field="tipoDeServicio"
                header="Tipo de Servicio"
            ></Column>
            <Column
                field="proyecto_id.cliente_id.cliente"
                header="Cliente"
            ></Column>
            <Column
                field="proyecto_id.cliente_id.numeroDocumento"
                header="RUC / DNI"
            ></Column>
            <Column
                field="totalSinIgv"
                header="Total Sin IGV"
            ></Column>
            <Column
                field="igv"
                header="IGV"
            ></Column>
            <Column
                field="totalConIgv"
                header="Total Con IGV"
            ></Column>
            <Column field="estado" header="Estado"
                style={{
                    justifyItems: "center",
                    // display: window.innerWidth <= 1250 ? "none" : "table-cell",
                }}
                body={(rowData) => {
                    let color
                    switch (rowData.estado) {
                        case "APROBADO":
                            color = "text-green-600";
                            break;
                        case "PENDIENTE":
                            color = "text-yellow-500";
                            break;
                        case "ANULADO":
                            color = "text-red-600";
                            break;
                        default:
                            color = "text-gray-600";
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

export default ListCotizacionesComercial;