import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import EditParametros from "../Permissions/Edit";
import ViewParametros from "../Permissions/view";

const ListParametrosComercial = ({
    permissionEdit,
    permissionDelete,
    permissionRead
}) => {
    const fetchData = async (page = 0, limit = 10, search = "") => {
        const response = await axios.get("/comercial/getParametrosPaginacion", {
            params: {
                page,
                limit,
                search
            }
        });
        return {
            data: response.data.data,
            totalRecords: response.data.total
        }
    }

    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            DetailItem={ViewParametros}
            EditItem={EditParametros}
            fetchData={fetchData}
            title={"parametros_cliente"}
        >
            <Column field="tipoDeAnalisis" header="Matriz" style={{ paddingLeft: "60px" }} ></Column>
            <Column field="parametro" header="Parámetro" ></Column>
            <Column field="metodo" header="Método" ></Column>
            <Column field="unidadDeMedida" header="Unidad de Medida" ></Column>
            <Column field="precio" header="Precio Soles" ></Column>
        </ListPrincipal>
    )
}

export default ListParametrosComercial;