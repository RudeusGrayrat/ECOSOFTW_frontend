type ToastTone = "success" | "error" | "warning" | "info";
type RequestToast = { tone: ToastTone; title: string; message: string };

const emit = (name: string, detail?: unknown) => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name, { detail }));
};

let pending = 0;

export const beginRequestFeedback = () => {
  pending += 1;
  emit("ecosystem:request-state", { pending });
};

export const endRequestFeedback = () => {
  pending = Math.max(0, pending - 1);
  emit("ecosystem:request-state", { pending });
};

export const publishRequestToast = (toast: RequestToast) => emit("ecosystem:request-toast", toast);

export const toneFromLegacyType = (type?: string): ToastTone => {
  if (type === "Correcto") return "success";
  if (type === "Error") return "error";
  if (type === "Advertencia" || type === "Aviso") return "warning";
  return "info";
};
