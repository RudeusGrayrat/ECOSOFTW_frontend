import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewCliente = ({ selected, setShowDetail }) => {
    console.log("Viewing cliente:", selected);
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DEL CLIENTE</span>
            <div className="flex flex-col flex-wrap overflow-y-hidden mt-4 ml-2">
                <PDetail content="TIPO DE CLIENTE" value={selected?.tipoCliente} />
                <PDetail content="CLIENTE" value={selected?.cliente} />
                <PDetail content="DIRECCIÓN LEGAL" value={selected?.direccionLegal} />
                <PDetail content="NUMERO DE DOCUMENTO" value={selected?.numeroDocumento} />
                <PDetail content="CORREO ELECTRÓNICO" value={selected?.correoElectronico} />
                <PDetail content="TELÉFONO" value={selected?.telefono} />
                {selected.tipoCliente === "EMPRESA" && <PDetail content="CONTACTO" value={selected?.nombreContacto} />}
                <PDetail content="ESTADO" value={selected?.estado} />
            </div>
        </Details>
    );
}

export default ViewCliente;