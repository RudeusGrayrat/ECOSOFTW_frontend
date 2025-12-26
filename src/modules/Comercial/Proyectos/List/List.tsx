import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";

const ListProyectos = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
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
export default ListProyectos;