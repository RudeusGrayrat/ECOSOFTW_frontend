import dayjs from "dayjs";
import convertDocx from "../../../../components/utils/convertDocx";
const {
  VITE_PLANTILLA_COTIZACION_ECOLOGY
} = import.meta.env;

const renderDoc = async (Cotizacion) => {
  let PLANTILLA_DOCUMENT = VITE_PLANTILLA_COTIZACION_ECOLOGY
  try {
    const transformData = (data) => {
      console.log("data para transformar en renderDoc", data);


      const mapAnalisisItem = (a) => {
        const p = a.parametro_id;
        return {
          categoria: p.categoria,
          parametro: p.parametro,
          metodologia: p.metodo,
          acreditacion: p.acreditadoPor,
          unidad_de_medida: p.unidadDeMedida,
          ldm: p.limiteDeDeteccionDelMetodo,
          lcm: p.limiteDeCuantificacionDelMetodo,
          precio_unitario: `S/. ${p.precio}`,
          cantidad: a.cantidad,
          subtotal: `S/. ${a.subtotal}`,
        };
      };
      const buildAnalisisByTipo = (analisis, tipo) => {
        return analisis
          .filter(a => a.parametro_id.tipoDeAnalisis === tipo)
          .map(mapAnalisisItem);
      };

      const agua = buildAnalisisByTipo(data.analisis, "AGUA");
      const aire = buildAnalisisByTipo(data.analisis, "AIRE");
      const suelo = buildAnalisisByTipo(data.analisis, "SUELO");
      const ruido = buildAnalisisByTipo(data.analisis, "RUIDO");
      const emisiones = buildAnalisisByTipo(data.analisis, "EMISIONES");




      const fechaEmisionString = dayjs(data.createdAt).format("DD/MM/YYYY");
      const fechaVencimientoString = dayjs(data.createdAt).add(30, 'day').format("DD/MM/YYYY");
      console.log("fechaEmisionString", fechaEmisionString);
      console.log("fechaVencimientoString", fechaVencimientoString);
      const TIEMPO_ENTREGA_MAP = {
        "INFORME DE ENSAYO": "x1",
        "TRANSPORTE": "x2",
        "EQUIPOS DE CAMPO": "x3",
        "PERSONAL DE CAMPO": "x4",
        "INFORME DE MONITOREO": "x5",
      };
      const xMapped = { x1: "", x2: "", x3: "", x4: "", x5: "" };
      (data.tiempoDeEntrega || []).forEach((item) => {
        const key = TIEMPO_ENTREGA_MAP[item];
        if (key) {
          xMapped[key] = "X";
        }
      });


      const formattedData = {
        correlativa_doc: data.correlativaVisible,
        tipo_de_servicio: data.tipoDeServicio,
        cliente: data.proyecto_id.cliente_id.cliente,
        nombre_proyecto: data.proyecto_id.nombre,
        numero_documento: data.proyecto_id.cliente_id.numeroDocumento,
        contacto: data.proyecto_id.cliente_id.nombreContacto,
        telefono: data.proyecto_id.cliente_id.telefono,
        correo: data.proyecto_id.cliente_id.correoElectronico,
        fecha_emision: fechaEmisionString,
        fecha_vigencia: fechaVencimientoString,

        ...xMapped,

        show_agua: agua.length > 0,
        agua,
        total_agua: `S/. ${data.totalAgua}`,

        show_aire: aire.length > 0,
        aire,
        total_aire: `S/. ${data.totalAire}`,

        show_suelo: suelo.length > 0,
        suelo,
        total_suelo: `S/. ${data.totalSuelo}`,

        show_ruido: ruido.length > 0,
        ruido,
        total_ruido: `S/. ${data.totalRuido}`,

        show_emisiones: emisiones.length > 0,
        emisiones,
        total_emisiones: `S/. ${data.totalEmisiones}`,

        gastos_operativos: [],
        total_gastos_op: "data",

        gastos_administrativos: [],
        total_gastos_ad: "data",

        gastos_generales: [],
        total_gastos_generales: "data",

        total_sin_igv: `S/. ${data.totalSinIgv}`,
        direccion_legal: data.proyecto_id.cliente_id.direccionLegal,
        lugar_muestreo: data.proyecto_id.lugarMuestreo,
      };

      return formattedData;
    };

    const formExcel = transformData(Cotizacion);

    const archivo = PLANTILLA_DOCUMENT;
    if (!archivo) throw new Error("No se encontró la plantilla del documento");

    const convertir = await convertDocx(formExcel, archivo, "Cotizacion_Comercial");
    if (!convertir)
      throw new Error(
        "No se pudo completar el proceso de renderizado de la Cotizacion",
        "Error"
      );
    return convertir;
  } catch (error) {
    console.error("Error al renderizar la Cotizacion:", error);
    throw new Error(error, "Error");
  }
};

export default renderDoc;
