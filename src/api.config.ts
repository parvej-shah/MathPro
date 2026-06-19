function getDefaultBackendUrl() {
  if (typeof window === "undefined") return "http://localhost:8000";
  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || getDefaultBackendUrl();
