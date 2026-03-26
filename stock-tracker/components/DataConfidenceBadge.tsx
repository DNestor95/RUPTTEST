import { AlertTriangle } from "lucide-react";
import clsx from "clsx";

interface DataConfidenceBadgeProps {
  sources: string[];
  discrepancy: boolean;
  className?: string;
}

export default function DataConfidenceBadge({
  sources,
  discrepancy,
  className,
}: DataConfidenceBadgeProps) {
  const textColor =
    sources.length >= 3
      ? "text-emerald-400"
      : sources.length === 2
      ? "text-yellow-400"
      : "text-red-400";

  const bgColor =
    sources.length >= 3
      ? "bg-emerald-400/10"
      : sources.length === 2
      ? "bg-yellow-400/10"
      : "bg-red-400/10";

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {discrepancy && (
        <span title="Price discrepancy >1% across sources">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
        </span>
      )}
      <span
        className={clsx(
          "rounded-full px-2 py-0.5 text-[10px] font-medium",
          textColor,
          bgColor
        )}
        title={`Sources: ${sources.join(", ")}`}
      >
        {sources.length}/3 sources
      </span>
    </div>
  );
}
