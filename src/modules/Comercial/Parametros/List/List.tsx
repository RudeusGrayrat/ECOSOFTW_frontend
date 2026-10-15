import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import EditParametros from "../Permissions/Edit";
import ViewParametros from "../Permissions/View";
import DeleteParametros from "../Permissions/Delete";

const ListParametrosComercial = ({
    permissionEdit,
    permissionDelete,
    permissionRead
}) => {
    const tableFilters = {
        tipoDeAnalisis: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        tipoItem: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        unidadCobro: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        estado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    };
    const fetchData = async (page = 0, limit = 10, search = "", filters = {}) => {
        const response = await axios.get("/comercial/getParametrosPaginacion", {
            params: {
                page,
                limit,
                search,
                includeInactive: true,
                filters: JSON.stringify(filters || {}),
            }
        });
        return {
            data: response.data.data,
            total: response.data.total
        }
    }
    const selectFilter = (options, values, placeholder) => <Dropdown value={options.value} options={values} onChange={(event) => options.filterCallback(event.value)} placeholder={placeholder} showClear className="w-full rounded-xl text-sm" />;

    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            DetailItem={ViewParametros}
            EditItem={EditParametros}
            DeleteItem={DeleteParametros}
            fetchData={fetchData}
            tableFilters={tableFilters}
            title={"parametros_cliente"}
        >
            <Column field="tipoDeAnalisis" header="Matriz" style={{ paddingLeft: "60px" }} filter showFilterMatchModes={false} showFilterOperator={false} maxConstraints={1} filterElement={(options) => selectFilter(options, ["AGUA", "AIRE", "SUELO", "RUIDO", "EMISIONES", "MONITOREO OCUPACIONAL"], "Todas")} ></Column>
            <Column field="nombreCorto" header="Nombre corto" body={(rowData) => rowData.nombreCorto || "Sin clasificar"} ></Column>
            <Column field="tipoItem" header="Tipo" body={(rowData) => rowData.tipoItem || "LEGADO"} filter showFilterMatchModes={false} showFilterOperator={false} maxConstraints={1} filterElement={(options) => selectFilter(options, ["INDIVIDUAL", "PAQUETE", "CAMPO"], "Todos")} ></Column>
            <Column field="unidadCobro" header="Cobro" body={(rowData) => rowData.unidadCobro || "POR_UNIDAD"} filter showFilterMatchModes={false} showFilterOperator={false} maxConstraints={1} filterElement={(options) => selectFilter(options, ["POR_UNIDAD", "POR_PUNTO", "POR_MUESTRA", "POR_DIA", "POR_CAMPANA", "POR_EQUIPO"], "Todos")} ></Column>
            <Column field="precio" header="Precio Soles" ></Column>
            <Column field="estado" header="Estado" filter showFilterMatchModes={false} showFilterOperator={false} maxConstraints={1} filterElement={(options) => selectFilter(options, ["ACTIVO", "INACTIVO"], "Todos")} ></Column>
        </ListPrincipal>
    )
}

export default ListParametrosComercial;
