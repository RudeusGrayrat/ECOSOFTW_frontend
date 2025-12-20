import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";

const convertDocx = async (predata, archivo, nameDoc) => {
  try {
    if (!archivo) {
      throw new Error("Archivo de plantilla no disponible", "Ups !");
    }

    const data = {
      ...predata,
      missingKey: "", // Valor predeterminado para campos faltantes.
    };

    const response = await axios.get(archivo, {
      responseType: "arraybuffer",
    });

    let content = response.data;

    if (!content || !(content instanceof ArrayBuffer)) {
      throw new Error("El archivo descargado está vacío o no es válido");
    }

    content = new Uint8Array(content);

    const zip = new PizZip(content);
    if (!zip.file("word/document.xml")) {
      throw new Error("El archivo no parece ser una plantilla válida de Word.");
    }

    // Probar si los marcadores están presentes
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "{{", end: "}}" },
    });

    // Renderizar documento
    doc.render(data);

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Aseguramos el tipo MIME correcto
    });
    if (!blob) {
      throw new Error("No se pudo generar el archivo .docx ");
    }

    const file = new File([blob], `${nameDoc}.docx`, {
      type:
        blob.type ||
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return file;
  } catch (error) {
    throw new Error(error.message || "Error al descargar el contrato", "Error");
  }
};

export default convertDocx;
