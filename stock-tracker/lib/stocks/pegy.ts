/**
 * PEGY Ratio = P/E ÷ (EPS Growth % + Dividend Yield %)
 *
 * A PEGY < 1 suggests a potentially undervalued stock relative to
 * its growth and income. Above 2 may indicate overvaluation.
 *
 * All parameters are raw percentages (e.g. 15 for 15%).
 */
export function calculatePEGY(
  pe: number,
  epsGrowthPercent: number,
  dividendYieldPercent: number
): number | null {
  if (pe <= 0) return null;
  const denominator = epsGrowthPercent + dividendYieldPercent;
  if (denominator <= 0) return null;
  return pe / denominator;
}

export function pegylabel(pegy: number | null): string {
  if (pegy === null) return "N/A";
  if (pegy < 0.5) return "Deep Value";
  if (pegy < 1) return "Undervalued";
  if (pegy < 1.5) return "Fair Value";
  if (pegy < 2) return "Slightly Rich";
  return "Overvalued";
}

export function pegyColor(pegy: number | null): string {
  if (pegy === null) return "text-gray-400";
  if (pegy < 1) return "text-emerald-400";
  if (pegy < 1.5) return "text-yellow-300";
  if (pegy < 2) return "text-orange-400";
  return "text-red-400";
}
