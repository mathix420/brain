import { nanoid } from "nanoid";

// Number of toasts to show
const HISTORY_LIMIT = 3;
const DEFAULT_TTL = 8000;

export type Toast = {
  uuid: string;
  ttl: number;
  content: string;
  visible: boolean;
  type: "info" | "success" | "warning" | "error";
};

export const useToasts = () => useState<Toast[]>("toasts", () => []);
export function useToast() {
  const toasts = useToasts();

  function pushToast(toast: Omit<Toast, "uuid" | "visible">) {
    const uuid = nanoid();

    toasts.value.push({ uuid, visible: true, ...toast });

    if (toast.ttl) {
      setTimeout(() => {
        toasts.value = toasts.value.filter((x) => x.uuid !== uuid);
      }, toast.ttl);
    }

    // Hide older toasts
    toasts.value.slice(0, -HISTORY_LIMIT).map((x) => (x.visible = false));
  }

  function dismiss(uuid: string) {
    toasts.value = toasts.value.filter((x) => x.uuid !== uuid);
    // Show needed toasts
    toasts.value.slice(-HISTORY_LIMIT).map((x) => (x.visible = true));
  }

  function error(content: string, ttl: number = DEFAULT_TTL) {
    pushToast({ content, type: "error", ttl });
  }

  function warn(content: string, ttl: number = DEFAULT_TTL) {
    pushToast({ content, type: "warning", ttl });
  }

  function success(content: string, ttl: number = DEFAULT_TTL) {
    pushToast({ content, type: "success", ttl });
  }

  function info(content: string, ttl: number = DEFAULT_TTL) {
    pushToast({ content, type: "info", ttl });
  }

  return { info, success, warn, error, dismiss };
}
