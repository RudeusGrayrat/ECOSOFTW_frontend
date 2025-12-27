import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../components/Ui/Otros/PDtail";

const ViewParametros = ({ selected, setShowDetail }) => {
    console.log("Viewing parametros:", selected);
    return (
        <Details setShowDetail={setShowDetail}>
            <span className="text-3xl font-semibold ">DATOS DEL PÁRAMETRO</span>
            <div className="flex flex-col flex-wrap overflow-y-hidden mt-4 ml-2">
                <PDetail content="TIPO DE PARAMETRO" value={selected?.tipoDeAnalisis} />
                {selected.tipoDeAnalisis === "AGUA" && <PDetail content="CATEGORÍA" value={selected?.categoria} />}
                <PDetail content="PARÁMETRO" value={selected?.parametro} />
                <PDetail content="MÉTODO" value={selected?.metodo} />
                <PDetail content="TIPO DE ACREDITACION" value={selected?.tipoDeAcreditacion} />
                <PDetail content="ACREDITADO POR" value={selected?.acreditadoPor} />
                <PDetail content="LÍMITE DE DETECCIÓN DEL MÉTODO (L.D.M.)" value={selected?.limiteDeDeteccionDelMetodo} />
                <PDetail content="LÍMITE DE CUANTIFICACIÓN DEL MÉTODO (L.C.M.)" value={selected?.limiteDeCuantificacionDelMetodo} />
                <PDetail content="UNIDAD DE MEDIDA" value={selected?.unidadDeMedida} />
                <PDetail content="PRECIO (SOLES)" value={selected?.precio} />
                <PDetail content="ESTADO" value={selected?.estado} />
            </div>
        </Details>
    )
}

export default ViewParametros;