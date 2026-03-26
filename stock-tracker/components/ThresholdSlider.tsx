"use client";

import { useEffect, useState } from "react";

interface ThresholdSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export default function ThresholdSlider({ value, onChange }: ThresholdSliderProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    setLocal(v);
    onChange(v);
  }

  return (
    <div className="flex items-center gap-4">
      <label className="whitespace-nowrap text-sm text-gray-400">
        Showing moves{" "}
        <span className="font-semibold text-white">≥ {local.toFixed(1)}%</span>
      </label>
      <input
        type="range"
        min={0.5}
        max={10}
        step={0.5}
        value={local}
        onChange={handleChange}
        className="w-40 cursor-pointer"
      />
    </div>
  );
}
