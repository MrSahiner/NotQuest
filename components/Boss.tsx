// Tanıtım videosundaki piksel canavarın aynısı, SVG olarak.
const PIX = [
  "..h......h..",
  ".hh......hh.",
  ".hbbbbbbbbh.",
  ".bbbbbbbbbb.",
  "bbbeebbeebbb",
  "bbbepbbepbbb",
  "bbbbbbbbbbbb",
  "bbmmmmmmmmbb",
  "bbmwmwmwmmbb",
  ".bbbbbbbbbb.",
  "..bb....bb..",
  "..bb....bb..",
];

type Props = {
  color?: string;
  size?: number;
  flash?: boolean;
  dim?: boolean;
  className?: string;
};

export default function Boss({ color = "#b15cff", size = 96, flash = false, dim = false, className = "" }: Props) {
  const fill: Record<string, string> = {
    h: "#ffd166",
    b: color,
    e: "#ffffff",
    p: "#1a0b2e",
    m: "#1a0b2e",
    w: "#ffffff",
  };
  const rects: React.ReactNode[] = [];
  PIX.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === ".") return;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={flash ? "#ffffff" : fill[c]} />);
    }),
  );
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      style={{ opacity: dim ? 0.35 : 1, filter: dim ? "grayscale(1)" : undefined }}
      aria-hidden
    >
      {rects}
    </svg>
  );
}
