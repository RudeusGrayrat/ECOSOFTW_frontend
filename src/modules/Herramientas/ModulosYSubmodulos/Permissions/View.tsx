import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewModulosYSubmodulos = ({ selected, setShowDetail }) => {
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DE LA ESTRUCTURA</span>
            <div className="flex flex-col flex-wrap overflow-y-hidden mt-4 ml-2">
                <PDetail content="TIPO" value={selected?.tipo} />
                <PDetail content="MODULO" value={selected?.module} />
                {selected?.tipo === "SUBMODULO" && <PDetail content="SUBMODULO" value={selected?.name} />}
                <PDetail content="ORDEN" value={selected?.order} />
                <PDetail content="ESTADO" value={selected?.estado} />
            </div>
        </Details>
    );
}

export default ViewModulosYSubmodulos;
