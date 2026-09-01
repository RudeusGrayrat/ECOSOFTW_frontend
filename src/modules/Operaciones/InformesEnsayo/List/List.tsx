import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import ApproveInformesEnsayo from "../Permissions/Approve";
import DisapproveInformesEnsayo from "../Permissions/Disapprove";
import ViewInformesEnsayo from "../Permissions/View";

const ListInformesEnsayo = ({
    permissionRead,
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

    const openPdf = async (rowData, download = false) => {
        const response = await axios.get(`/operaciones/informes-ensayo/${rowData._id}/archivo`, {
            params: { download },
            responseType: "blob"
        });
        const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        if (download) {
            const link = document.createElement("a");
            link.href = url;
            link.download = rowData.archivoGenerado || `${rowData.codigo}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            return;
        }
        window.open(url, "_blank");
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
            <Column header="PDF"
                body={(rowData) => (
                    <div className="flex gap-3">
                        <button className="text-sky-600 font-semibold" onClick={() => openPdf(rowData)}>Ver</button>
                        <button className="text-emerald-600 font-semibold" onClick={() => openPdf(rowData, true)}>Descargar</button>
                    </div>
                )}
            />
        </ListPrincipal>
    )
}

export default ListInformesEnsayo;
