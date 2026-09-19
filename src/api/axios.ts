import axios from "axios";
import { beginRequestFeedback, endRequestFeedback, publishRequestToast } from "./requestFeedback";
const urlServer = import.meta.env.VITE_SERVER_URL
const instance = axios.create({
  baseURL: urlServer,
  withCredentials: true,
});

const isMutation = (method?: string) => ["post", "put", "patch", "delete"].includes((method || "get").toLowerCase());
const requestMessage = (payload: any, fallback: string) => typeof payload?.message === "string" && payload.message.trim() ? payload.message : fallback;

instance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Solo bloqueamos mutaciones: bloquear cada GET automático haría que la aplicación parpadee al listar o actualizar notificaciones.
  if (isMutation(config.method) && config.globalFeedback !== false) {
    config.__globalFeedbackStarted = true;
    beginRequestFeedback();
  }
  return config;
});

instance.interceptors.response.use(
  (response: any) => {
    const config = response.config || {};
    if (config.__globalFeedbackStarted) endRequestFeedback();
    if (isMutation(config.method) && config.globalFeedback !== false && !config.silentSuccess) {
      publishRequestToast({ tone: "success", title: "Operación completada", message: requestMessage(response.data, "Los cambios fueron guardados correctamente.") });
    }
    return response;
  },
  (error: any) => {
    const config = error?.config || {};
    if (config.__globalFeedbackStarted) endRequestFeedback();
    if (isMutation(config.method) && config.globalFeedback !== false) {
      const status = error?.response?.status;
      publishRequestToast({ tone: status && status < 500 ? "warning" : "error", title: status ? `No se pudo completar la operación (${status})` : "Error de conexión", message: requestMessage(error?.response?.data, "No se recibió respuesta del servidor. Intenta nuevamente.") });
    }
    return Promise.reject(error);
  }
);

export default instance;
