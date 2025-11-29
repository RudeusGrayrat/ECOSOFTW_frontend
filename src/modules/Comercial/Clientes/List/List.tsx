
import { Column } from "primereact/column";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import ListPrincipal from "../../../../components/Principal/List/List";

const ListClientesComercial = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
}) => {
    const sendMessage = useSendMessage();

    const fetchClientesComercial = async (page, limit, search) => {
        try {
            const response = {
                data: {
                    data: [{
                        id: 1,
                        tipoCliente: "EMPRESA",
                        razonSocial: "Tech Solutions S.A.",
                        rucEmpresa: "20123456789",
                        telefono: "+51 987654321",
                        correo: "juan.perez@techsolutions.com",
                        servicio: "Desarrollo de Software",
                        cantidadPuntosParametros: 5,
                        lugarMuestreo: "Lima, Perú",
                        fechaServicio: "2024-06-15",
                        direccionLegal: "Av. Principal 123, Lima",
                    }, {
                        id: 2,
                        tipoCliente: "PERSONA NATURAL",
                        dniCliente: "87654321",
                        nombreCliente: "Maria Lopez",
                        telefono: "+51 912345678",
                        correo: "maria.lopez@gmail.com",
                        servicio: "Consultoría",
                        cantidadPuntosParametros: 3,
                        lugarMuestreo: "Lima, Perú",
                        fechaServicio: "2024-07-20",
                        direccionLegal: "Av. Secundaria 456, Lima",
                    }],
                    total: 2,
                },

            }

            return {
                data: response.data?.data,
                total: response.data?.total,
            };
        } catch (error) {
            sendMessage(
                error.message || "Error al recargar la lista de colaboradores",
                "Error"
            );
        }
    };
    return (
        <ListPrincipal
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            fetchData={fetchClientesComercial}
            reload={fetchClientesComercial}
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
    );
};

export default ListClientesComercial;
