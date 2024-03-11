export default function imgProxy(uri: string) {
  return `/api/imageProxy?uri=${encodeURIComponent(uri)}`;
}
