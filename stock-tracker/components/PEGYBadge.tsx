import { pegyColor, pegylabel } from "@/lib/stocks/pegy";
import clsx from "clsx";

interface PEGYBadgeProps {
  pegy: number | null;
  className?: string;
}

const colorToBg: Record<string, string> = {
  "text-emerald-400": "bg-emerald-400/10",
  "text-yellow-400": "bg-yellow-400/10",
  "text-red-400": "bg-red-400/10",
};

export default function PEGYBadge({ pegy, className }: PEGYBadgeProps) {
  const label = pegylabel(pegy);
  const textColor = pegyColor(pegy);
  const bgColor = colorToBg[textColor] ?? "bg-white/5";

  return (
    <div className={clsx("flex flex-col items-start gap-0.5", className)}>
      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">PEGY</span>
      <span className={clsx("text-sm font-bold", textColor)}>
        {pegy !== null ? pegy.toFixed(2) : "—"}
      </span>
      {label && (
        <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-medium", textColor, bgColor)}>
          {label}
        </span>
      )}
    </div>
  );
}
