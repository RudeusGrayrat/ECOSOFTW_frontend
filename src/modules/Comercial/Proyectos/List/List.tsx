import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";

const ListProyectos = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
}) => {
    const fetchData = async (limit: Number, page: Number, search: String) => {
        console.log("Fetch Proyectos", { limit, page, search });
        return {
            data: [],
            total: 0
        }
    }
    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            fetchData={fetchData}
            reload={fetchData}
            title={"comercial_proyectos"}
        >
            <Column field="proyecto" header="Proyecto"></Column>
            <Column field="cliente.tipoCliente" header="Tipo de Cliente"></Column>
            <Column field={(rowData) => rowData.cliente.tipoCliente === "EMPRESA" ? rowData.cliente.rucEmpresa : rowData.cliente.dniCliente} header="RUC / DNI"></Column>
            <Column field={(rowData) => rowData.cliente.tipoCliente === "EMPRESA" ? rowData.cliente.razonSocial : rowData.cliente.nombreCliente} header="Razón Social / Nombre"></Column>
            <Column field="fechaInicio" header="Fecha de Inicio"></Column>
            <Column field="estado" header="Estado"></Column>

        </ListPrincipal>
    )
}
export default ListProyectos;