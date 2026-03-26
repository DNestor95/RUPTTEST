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
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {discrepancy && (
        <span title="Price discrepancy >1% across sources">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
        </span>
      )}
      <span
        className={clsx(
          "text-xs",
          sources.length >= 3
            ? "text-emerald-400"
            : sources.length === 2
            ? "text-yellow-400"
            : "text-red-400"
        )}
        title={`Sources: ${sources.join(", ")}`}
      >
        {sources.length}/3 sources
      </span>
    </div>
  );
}
