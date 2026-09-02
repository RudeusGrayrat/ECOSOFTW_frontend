import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ApproveInformesEnsayo from "../Permissions/Approve";
import DisapproveInformesEnsayo from "../Permissions/Disapprove";
import ViewInformesEnsayo from "../Permissions/View";
import PdfActionsInformesEnsayo from "../Permissions/PdfActions";

const ListInformesEnsayo = ({
    permissionRead,
    permissionReport,
    permissionApprove,
    permissionDisapprove
}) => {
    const fetchData = async (page, limit, search) => {
        const response = await axios.get("/operaciones/informes-ensayo", {
            params: { limit, page, search }
        });
        return {
            data: response.data.data,
            total: response.data.total
        }
    }

    return (
        <ListPrincipal
            permissionEdit={false}
            permissionDelete={false}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            ApproveItem={ApproveInformesEnsayo}
            DisapproveItem={DisapproveInformesEnsayo}
            DetailItem={ViewInformesEnsayo}
            ExtraActions={(props) => (
                <PdfActionsInformesEnsayo
                    {...props}
                    permissionRead={permissionRead}
                    permissionReport={permissionReport}
                />
            )}
            title={"operaciones_informes_ensayo"}
            fetchData={fetchData}
        >
            <Column field="codigo" header="Código" style={{ paddingLeft: "60px" }} />
            <Column field="archivoGenerado" header="Archivo Generado" />
            <Column field="idAcceso" header="ID de Acceso" />
            <Column field="versionActual" header="Versión" />
            <Column field="estado" header="Estado"
                style={{ justifyItems: "center" }}
                body={(rowData) => {
                    const color =
                        rowData.estado === "DISPONIBLE"
                            ? " text-green-500 "
                            : " text-red-500 ";
                    return (
                        <div className={`text-center bg-linear-to-tr from-white to-gray-100 shadow-inner rounded-xl font-semibold px-5 py-1 ${color}`}>
                            {rowData.estado}
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
    )
}

export default ListInformesEnsayo;
