import dayjs from "dayjs";
import convertDocx from "../../../../components/utils/convertDocx";
const {
  VITE_PLANTILLA_COTIZACION_ECOLOGY,
  VITE_PLANTILLA_COTIZACION_ECOLOGY_PENDIENTE
} = import.meta.env;

const renderDoc = async (Cotizacion) => {
  console.log("Cotizacion para renderizar documento:", Cotizacion);
  let PLANTILLA_DOCUMENT = VITE_PLANTILLA_COTIZACION_ECOLOGY
  if (Cotizacion.estado === "PENDIENTE") {
    PLANTILLA_DOCUMENT = VITE_PLANTILLA_COTIZACION_ECOLOGY_PENDIENTE
  }
  try {
    const transformData = (data) => {
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
          subtotal: a.subtotal,
        };
      };
      const buildAnalisisByTipo = (analisis, tipo) => {
        return analisis
          .filter(a => a.parametro_id.tipoDeAnalisis === tipo)
          .map(mapAnalisisItem);
      };
      const calcularTotal = (items = []) =>
        items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
      const formatMoney = (value) => `S/. ${Number(value || 0).toFixed(2)}`;
      const withFormattedSubtotal = (items = []) =>
        items.map(item => ({
          ...item,
          subtotal: formatMoney(item.subtotal),
        }));

      const agua = buildAnalisisByTipo(data.analisis, "AGUA");
      const aire = buildAnalisisByTipo(data.analisis, "AIRE");
      const suelo = buildAnalisisByTipo(data.analisis, "SUELO");
      const ruido = buildAnalisisByTipo(data.analisis, "RUIDO");
      const emisiones = buildAnalisisByTipo(data.analisis, "EMISIONES");

      const gastosOperativos = data.gastosOperativos.map((gasto) => ({
        dias: gasto.dias,
        descripcion: gasto.tipoDeGasto_id.descripcion,
        cantidad: gasto.cantidad,
        precio: `S/. ${gasto.tipoDeGasto_id.precio}`,
        subtotal: gasto.subtotal,
      }));
      const gastosAdministrativos = data.gastosAdministrativos.map((gasto) => ({
        descripcion: gasto.tipoDeGasto_id.descripcion,
        cantidad: gasto.cantidad,
        precio: `S/. ${gasto.tipoDeGasto_id.precio}`,
        subtotal: gasto.subtotal,
      }));
      const gastosGenerales = data.gastosGenerales.map((gasto) => ({
        descripcion: gasto.descripcion,
        subtotal: gasto.subtotal,
      }));
      const fechaEmisionString = dayjs(data.createdAt).format("DD/MM/YYYY");
      const fechaVencimientoString = dayjs(data.createdAt).add(30, 'day').format("DD/MM/YYYY");

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
        agua: withFormattedSubtotal(agua),
        total_agua: formatMoney(calcularTotal(agua)),

        show_aire: aire.length > 0,
        aire: withFormattedSubtotal(aire),
        total_aire: formatMoney(calcularTotal(aire)),
        show_suelo: suelo.length > 0,
        suelo: withFormattedSubtotal(suelo),
        total_suelo: formatMoney(calcularTotal(suelo)),

        show_ruido: ruido.length > 0,
        ruido: withFormattedSubtotal(ruido),
        total_ruido: formatMoney(calcularTotal(ruido)),
        show_emisiones: emisiones.length > 0,
        emisiones: withFormattedSubtotal(emisiones),
        total_emisiones: formatMoney(calcularTotal(emisiones)),

        gastos_operativos: withFormattedSubtotal(gastosOperativos),
        total_gastos_op: formatMoney(calcularTotal(gastosOperativos)),

        gastos_administrativos: withFormattedSubtotal(gastosAdministrativos),
        total_gastos_ad: formatMoney(calcularTotal(gastosAdministrativos)),

        gastos_generales: withFormattedSubtotal(gastosGenerales),
        total_gastos_generales: formatMoney(calcularTotal(gastosGenerales)),

        total_sin_igv: formatMoney(data.totalSinIgv),
        direccion_legal: data.proyecto_id.cliente_id.direccionLegal,
        lugar_muestreo: data.proyecto_id.lugarMuestreo,

        colaboradorAsesor: data.actualizadoPor?.colaborador || data.creadoPor.colaborador || "",
        correoAsesor: data.actualizadoPor?.correoElectronico || data.creadoPor.correoElectronico || "",
        numeroAsesor: data.actualizadoPor?.telefono || data.creadoPor.telefono || "",
        puestoAsesor: data.actualizadoPor?.puesto || data.creadoPor.puesto || "",
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
