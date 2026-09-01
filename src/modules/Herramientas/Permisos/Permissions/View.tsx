import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewPermisos = ({ selected, setShowDetail }) => {
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DEL PERMISO</span>
            <div className="flex flex-col flex-wrap overflow-y-hidden mt-4 ml-2">
                <PDetail content="PERMISO" value={selected?.name} />
                <PDetail content="DESCRIPCIÓN" value={selected?.description} />
                <PDetail content="ESTADO" value={selected?.estado} />
            </div>
        </Details>
    );
}

export default ViewPermisos;
