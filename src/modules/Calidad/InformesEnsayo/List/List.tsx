import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ApproveInformesEnsayo from "../Permissions/Approve";
import ViewInformesEnsayo from "../Permissions/View";
import PdfActionsInformesEnsayo from "../Permissions/PdfActions";
import ReleaseInformesEnsayo from "../Permissions/Release";
import DeleteInformesEnsayo from "../Permissions/Delete";
import BulkActionsInformesEnsayo from "./BulkActions";
import { useSearchParams } from "react-router-dom";

const ListInformesEnsayo = ({
    permissionRead,
    permissionReport,
    permissionSend,
    permissionApprove,
    permissionDelete
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const papelera = searchParams.get("papelera") === "true";

    const textMatchModes = [
        { label: "Contiene", value: FilterMatchMode.CONTAINS },
        { label: "Empieza con", value: FilterMatchMode.STARTS_WITH },
        { label: "Termina con", value: FilterMatchMode.ENDS_WITH },
        { label: "Igual a", value: FilterMatchMode.EQUALS },
        { label: "Diferente de", value: FilterMatchMode.NOT_EQUALS },
    ];

    const tableFilters = {
        codigo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        planMonitoreo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        matriz: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        idAcceso: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        acreditacion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        vistoBuenoJefatura: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        estado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    };

    const fetchData = async (page, limit, search, filters = {}, sort = {}) => {
        const response = await axios.get("/calidad/informes-ensayo", {
            params: {
                limit,
                page,
                search,
                papelera,
                filters: JSON.stringify(filters || {}),
                sortField: sort.sortField,
                sortOrder: sort.sortOrder,
            }
        });
        return {
            data: response.data.data,
            total: response.data.total
        }
    }

    const selectFilter = (options, values, placeholder) => (
        <Dropdown
            value={options.value}
            options={values}
            onChange={(event) => options.filterCallback(event.value)}
            placeholder={placeholder}
            showClear
            className="w-full rounded-xl text-sm"
        />
    );

    return (
        <div className="w-full">
        <ListPrincipal
            key={papelera ? "informes-papelera" : "informes-activos"}
            permissionEdit={false}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={false}
            ApproveItem={ApproveInformesEnsayo}
            DeleteItem={DeleteInformesEnsayo}
            DetailItem={ViewInformesEnsayo}
            ExtraActions={(props) => (
                <>
                    <ReleaseInformesEnsayo
                        {...props}
                        permissionSend={permissionSend}
                    />
                    <PdfActionsInformesEnsayo
                        {...props}
                        permissionRead={permissionRead}
                        permissionReport={permissionReport}
                    />
                </>
            )}
            title={"calidad_informes_ensayo"}
            fetchData={fetchData}
            tableFilters={tableFilters}
            HeaderActions={() => (
                <Button
                    icon={papelera ? "pi pi-list" : "pi pi-trash"}
                    data-pr-tooltip={papelera ? "Ver informes activos" : "Ver papelera"}
                    data-pr-position="top"
                    className={`w-16! rounded-xl! active:shadow-inner! focus:translate-x-px! ease-in-out! shadow-lg! bg-linear-to-r! from-gray-50! to-gray-100! ${papelera ? "text-emerald-600!" : "text-red-500!"}`}
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        if (papelera) params.delete("papelera");
                        else params.set("papelera", "true");
                        setSearchParams(params);
                    }}
                />
            )}
            selectable={permissionReport || permissionApprove || permissionSend}
            BulkActions={(props) => (
                <BulkActionsInformesEnsayo
                    {...props}
                    permissionReport={permissionReport}
                    permissionApprove={permissionApprove}
                    permissionSend={permissionSend}
                />
            )}
        >
            <Column field="codigo" header="Código" style={{ paddingLeft: "60px" }} sortable filter filterPlaceholder="Código" filterMatchModeOptions={textMatchModes} maxConstraints={3} />
            <Column field="planMonitoreo" header="Plan de Monitoreo" sortable filter filterPlaceholder="Plan de monitoreo" filterMatchModeOptions={textMatchModes} maxConstraints={3} />
            <Column field="matriz" header="Matriz" sortable filter filterPlaceholder="Matriz" filterMatchModeOptions={textMatchModes} maxConstraints={3} />
            <Column field="idAcceso" header="ID de Acceso" sortable filter filterPlaceholder="ID de acceso" filterMatchModeOptions={textMatchModes} maxConstraints={3} />
            <Column field="acreditacion" header="Acreditación" sortable filter showFilterMatchModes={false} showFilterOperator={false} maxConstraints={1}
                filterElement={(options) => selectFilter(options, [
                    { label: "INACAL", value: "INACAL" },
                    { label: "NAC", value: "NAC" },
                    { label: "Sin acreditación", value: "SIN_ACREDITACION" },
                ], "Todas")}
            />
            <Column field="estado" header="Estado"
                sortable
                filter
                showFilterMatchModes={false}
                showFilterOperator={false}
                maxConstraints={1}
                filterElement={(options) => selectFilter(options, [
                    { label: "Borrador", value: "BORRADOR" },
                    { label: "Preliminar", value: "PRELIMINAR" },
                    { label: "Liberado", value: "LIBERADO" },
                ], "Todos")}
                style={{ justifyItems: "center" }}
                body={(rowData) => {
                    const color =
                        rowData.estado === "LIBERADO"
                            ? " text-green-500 "
                            : rowData.estado === "PRELIMINAR"
                                ? " text-blue-500 "
                                : " text-orange-500 ";
                    return (
                        <div className={`text-center bg-linear-to-tr from-white to-gray-100 shadow-inner rounded-xl font-semibold px-5 py-1 ${color}`}>
                            {rowData.papelera ? "PAPELERA" : rowData.estado}
                        </div>
                    );
                }}
            />
        </ListPrincipal>
        </div>
    )
}

export default ListInformesEnsayo;
