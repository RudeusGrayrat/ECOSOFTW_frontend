import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ApproveInformesEnsayo from "../Permissions/Approve";
import ViewInformesEnsayo from "../Permissions/View";
import PdfActionsInformesEnsayo from "../Permissions/PdfActions";
import ReleaseInformesEnsayo from "../Permissions/Release";
import DeleteInformesEnsayo from "../Permissions/Delete";
import { useSearchParams } from "react-router-dom";

const ListInformesEnsayo = ({
    permissionRead,
    permissionReport,
    permissionApprove,
    permissionDelete
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const papelera = searchParams.get("papelera") === "true";

    const fetchData = async (page, limit, search) => {
        const response = await axios.get("/operaciones/informes-ensayo", {
            params: { limit, page, search, papelera }
        });
        return {
            data: response.data.data,
            total: response.data.total
        }
    }

    return (
        <div className="w-full">
            <div className="mb-3 flex justify-end px-6">
                <button
                    className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-2 font-semibold text-slate-600 shadow-lg transition-all hover:-translate-y-0.5"
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        if (papelera) params.delete("papelera");
                        else params.set("papelera", "true");
                        setSearchParams(params);
                    }}
                >
                    {papelera ? "Ver activos" : "Ver papelera"}
                </button>
            </div>
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
                        permissionReport={permissionReport}
                    />
                    <PdfActionsInformesEnsayo
                        {...props}
                        permissionRead={permissionRead}
                        permissionReport={permissionReport}
                    />
                </>
            )}
            title={"operaciones_informes_ensayo"}
            fetchData={fetchData}
        >
            <Column field="codigo" header="Código" style={{ paddingLeft: "60px" }} />
            <Column field="planMonitoreo" header="Plan de Monitoreo" />
            <Column field="matriz" header="Matriz" />
            <Column field="idAcceso" header="ID de Acceso" />
            <Column field="acreditacion" header="Acreditación" />
            <Column field="vistoBuenoJefatura" header="V° B° Jefatura"
                body={(rowData) => rowData.vistoBuenoJefatura ? "SI" : "NO"}
            />
            <Column field="estado" header="Estado"
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
            <Column field="urlConsulta" header="Consulta"
                body={(rowData) => rowData.urlConsulta ? (
                    <a className="text-sky-600 font-semibold" href={rowData.urlConsulta} target="_blank" rel="noreferrer">Abrir</a>
                ) : ""}
            />
        </ListPrincipal>
        </div>
    )
}

export default ListInformesEnsayo;
