import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import { useDispatch } from "react-redux";
import useSendMessage from "../../../../components/Ui/Messages/sendMessage";
import renderDoc from "./renderDoc";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import axios from "../../../../api/axios";
import ButtonOk from "../../../../components/Ui/Button/Buttons";

const ViewCotizacion = ({ selected, setShowDetail }) => {
    const [showDoc, setShowDoc] = useState(false);
    const [docxContent, setDocxContent] = useState("");
    const dispatch = useDispatch();
    const sendMessage = useSendMessage();
    console.log("selected cotizacion view", selected);

    useEffect(() => {
        const renderDocx = async () => {
            try {
                if (!selected || !selected.proyecto_id || !selected.proyecto_id.cliente_id) return sendMessage("Datos incompletos para generar el documento", "Error");
                const file = await renderDoc(selected);
                if (!file) {
                    sendMessage("Error al cargar el archivo", "Error");
                    return;
                }
                const codigo = selected.correlativaVisible;
                const cliente = selected.proyecto_id.cliente_id.cliente;
                const pathCloudinary = await documentoCloudinary(
                    file,
                    `${codigo}_${cliente}_CotizacionComercial`
                );
                setDocxContent(pathCloudinary.secure_url);
                setShowDoc(true);
                await axios.delete("herramientas/deleteDocumentCloudinary", {
                    data: { public_id: pathCloudinary.public_id },
                });
            } catch (error) {
                sendMessage(error, "Error");
            }
        };
        renderDocx();
    }, [selected]);


    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        docxContent
    )}`;
    return (
        <Details setShowDetail={setShowDetail} title="Detalle de Cotización">
            {showDoc ? (
                <div className="flex flex-col gap-4 p-[2%]">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Documento Cotización Generado</h2>
                    </div>
                    <div className="flex gap-7">
                        <div className="flex flex-col items-center gap-2 ">
                            <span className="text-xl font-medium text-gray-600">Ver Archivo</span>
                            <ButtonOk type="ok" onClick={() => window.open(officeViewerUrl, '_blank')}>
                                <div className="flex gap-2 items-center">

                                    <span>Visor Office</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </ButtonOk>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xl font-medium text-gray-600">Descargar Archivo</span>
                            <ButtonOk type="ok"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = docxContent;
                                    link.download = `Cotizacion_${selected.correlativaVisible}.docx`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);

                                }}
                            >
                                <div className="flex gap-2 items-center">
                                    <span>Guardar</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </ButtonOk>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Cargando...</p>
            )}

        </Details>
    )
}

export default ViewCotizacion;