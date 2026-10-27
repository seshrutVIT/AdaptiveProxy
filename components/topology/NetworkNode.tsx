import type { Point } from "./layout";

interface NetworkNodeProps {
  center: Point;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  isEmphasized?: boolean;
}

/** A labeled box used for the internet and the reverse proxy. */
export default function NetworkNode({
  center,
  width,
  height,
  title,
  subtitle,
  isEmphasized = false,
}: NetworkNodeProps) {
  const border = isEmphasized ? "stroke-blue-900" : "stroke-slate-400";

  return (
    <g transform={`translate(${center.x - width / 2} ${center.y - height / 2})`}>
      <rect width={width} height={height} rx={4} strokeWidth={isEmphasized ? 2.5 : 1.5} className={`fill-white ${border}`} />
      <text x={width / 2} y={height / 2 - 4} textAnchor="middle" className="fill-slate-900 text-[15px] font-semibold">
        {title}
      </text>
      <text x={width / 2} y={height / 2 + 16} textAnchor="middle" className="fill-slate-600 text-[12px]">
        {subtitle}
      </text>
    </g>
  );
}
