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
                <PDetail content="NOMBRE CORTO PARA COTIZAR" value={selected?.nombreCorto || "Sin clasificar"} />
                <PDetail content="ALCANCE TÉCNICO / PARÁMETRO" value={selected?.parametro} />
                <PDetail content="COMPONENTES INCLUIDOS" value={(selected?.componentes || []).join(", ") || "-"} />
                <PDetail content="TIPO DE ÍTEM" value={selected?.tipoItem || "LEGADO"} />
                <PDetail content="UNIDAD DE COBRO" value={selected?.unidadCobro || "POR_UNIDAD"} />
                <PDetail content="MÉTODO" value={selected?.metodo} />
                <PDetail content="TIPO DE ACREDITACION" value={selected?.tipoDeAcreditacion} />
                <PDetail content="ACREDITADO POR" value={selected?.acreditadoPor} />
                <PDetail content="LÍMITE DE DETECCIÓN DEL MÉTODO (L.D.M.)" value={selected?.limiteDeDeteccionDelMetodo} />
                <PDetail content="LÍMITE DE CUANTIFICACIÓN DEL MÉTODO (L.C.M.)" value={selected?.limiteDeCuantificacionDelMetodo} />
                <PDetail content="UNIDAD DE MEDIDA" value={selected?.unidadDeMedida} />
                <PDetail content="PRECIO (SOLES)" value={selected?.precio} />
                <PDetail content="VIGENCIA" value={`${selected?.vigenciaDesde ? new Date(selected.vigenciaDesde).toLocaleDateString() : "Sin fecha"}${selected?.vigenciaHasta ? ` al ${new Date(selected.vigenciaHasta).toLocaleDateString()}` : ""}`} />
                <PDetail content="ESTADO" value={selected?.estado} />
            </div>
        </Details>
    )
}

export default ViewParametros;
