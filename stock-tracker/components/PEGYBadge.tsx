import { pegyColor, pegylabel } from "@/lib/stocks/pegy";
import clsx from "clsx";

interface PEGYBadgeProps {
  pegy: number | null;
  className?: string;
}

export default function PEGYBadge({ pegy, className }: PEGYBadgeProps) {
  const label = pegylabel(pegy);
  const color = pegyColor(pegy);

  return (
    <div className={clsx("flex flex-col items-start", className)}>
      <span className="text-xs text-gray-500 uppercase tracking-wider">PEGY</span>
      <span className={clsx("text-sm font-semibold", color)}>
        {pegy !== null ? pegy.toFixed(2) : "—"}
      </span>
      <span className={clsx("text-xs", color)}>{label}</span>
    </div>
  );
}
