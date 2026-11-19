import { ICONS } from "@/lib/icons";

export default function Icon({ name, size = 24, className, stroke = 1.7 }: { name?: string; size?: number; className?: string; stroke?: number }) {
  const icon = name ? ICONS[name] : undefined;
  if (!icon) return null;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={icon.d} />
    </svg>
  );
}
