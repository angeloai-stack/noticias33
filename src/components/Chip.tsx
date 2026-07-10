interface ChipProps {
  label: string;
  href?: string;
  /** blue = normal, light = blanco sobre panel azul, pink = sobre la nota principal */
  variant?: "blue" | "light" | "pink";
}

const VARIANT_CLASSES = {
  blue: "bg-n33-blue text-white",
  light: "bg-white text-n33-blue",
  pink: "bg-n33-pink text-white",
};

/** Etiqueta de categoría con forma de listón inclinado (como en el mockup). */
export default function Chip({ label, href, variant = "blue" }: ChipProps) {
  const className = [
    "inline-block font-ui font-bold text-[0.78rem] leading-none",
    "pt-[0.3rem] pb-[0.35rem] pl-3 pr-5",
    "[clip-path:polygon(0_0,100%_0,calc(100%-11px)_100%,0_100%)]",
    "transition duration-200 group-hover:brightness-110",
    VARIANT_CLASSES[variant],
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
