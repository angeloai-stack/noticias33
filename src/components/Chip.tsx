interface ChipProps {
  label: string;
  href?: string;
  light?: boolean;
}

/** Etiqueta de categoría con forma de listón inclinado (como en el mockup). */
export default function Chip({ label, href, light = false }: ChipProps) {
  const className = [
    "inline-block font-ui font-bold text-[0.78rem] leading-none",
    "pt-[0.3rem] pb-[0.35rem] pl-3 pr-5",
    "[clip-path:polygon(0_0,100%_0,calc(100%-11px)_100%,0_100%)]",
    light ? "bg-white text-n33-blue" : "bg-n33-blue text-white",
  ].join(" ");

  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return <span className={className}>{label}</span>;
}
