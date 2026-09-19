import { publishRequestToast, toneFromLegacyType } from "../../../api/requestFeedback";

const useSendMessage = () => {
  return (message, type) => {
    if (!message) return;
    publishRequestToast({ tone: toneFromLegacyType(type), title: type || "Información", message: typeof message === "string" ? message : "Operación completada." });
  };
};

export default useSendMessage;
