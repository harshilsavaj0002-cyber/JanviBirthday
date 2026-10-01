import Image, { type ImageProps } from "next/image";

/** next/image that skips optimisation for SVG placeholders (real JPG/PNG/WebP photos are optimised). */
export function Photo(props: ImageProps) {
  const svg = typeof props.src === "string" && props.src.endsWith(".svg");
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is passed through props
  return <Image {...props} unoptimized={svg || props.unoptimized} />;
}
