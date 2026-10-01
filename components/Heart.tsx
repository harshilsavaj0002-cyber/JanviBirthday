import { useId } from "react";

export const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export function Heart({ className, gradient = true }: { className?: string; gradient?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F7E7CE" />
            <stop offset="0.5" stopColor="#B76E79" />
            <stop offset="1" stopColor="#8E4A56" />
          </linearGradient>
        </defs>
      )}
      <path d={HEART_PATH} fill={gradient ? `url(#${id})` : "currentColor"} />
    </svg>
  );
}
