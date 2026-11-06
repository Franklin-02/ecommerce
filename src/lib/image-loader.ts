/** GitHub Pages only: there is no image optimizer, and next/image doesn't add the base path itself. */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const path = src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
  return `${path}${path.includes("?") ? "&" : "?"}w=${width}`;
}
