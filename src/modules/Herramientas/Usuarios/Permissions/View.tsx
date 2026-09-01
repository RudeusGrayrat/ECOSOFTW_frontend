import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewUsuarios = ({ selected, setShowDetail }) => {
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DEL USUARIO</span>
            <div className="flex flex-col flex-wrap overflow-y-hidden mt-4 ml-2">
                <PDetail content="USUARIO" value={selected?.userName} />
                <PDetail content="COLABORADOR" value={selected?.colaborador} />
                <PDetail content="CORREO ELECTRÓNICO" value={selected?.correoElectronico} />
                <PDetail content="PUESTO" value={selected?.puesto} />
                <PDetail content="TELÉFONO" value={selected?.telefono} />
                <PDetail content="ESTADO" value={selected?.estado} />
                <span className="text-2xl font-semibold mt-6">ACCESOS</span>
                {selected?.modules?.map((item, index) => (
                    <PDetail
                        key={`${item.name}-${item.submodule?.name}-${index}`}
                        content={`${item.name} / ${item.submodule?.name}`}
                        value={item.submodule?.permissions?.join(", ")}
                    />
                ))}
            </div>
        </Details>
    );
}

export default ViewUsuarios;
