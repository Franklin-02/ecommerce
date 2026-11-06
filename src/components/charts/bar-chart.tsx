"use client";

import { useState } from "react";
import { AXIS_TEXT, GRID, SERIES_COLORS, niceTicks, useElementWidth } from "./chart-utils";

interface ColumnChartProps {
  labels: string[];
  values: number[];
  ariaLabel: string;
  seriesLabel: string;
  height?: number;
  formatAxis: (value: number) => string;
  formatValue: (value: number) => string;
}

const MARGIN = { top: 10, right: 8, bottom: 24, left: 42 };
const MAX_BAR = 24;

/** Column chart: one series, one colour, 4px rounded tops, per-column hover. */
export function ColumnChart({ labels, values, ariaLabel, seriesLabel, height = 260, formatAxis, formatValue }: ColumnChartProps) {
  const [containerRef, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const plotHeight = height - MARGIN.top - MARGIN.bottom;
  const ticks = niceTicks(Math.max(...values));
  const top = ticks[ticks.length - 1];
  const band = plotWidth / Math.max(values.length, 1);
  const barWidth = Math.max(Math.min(band - 2, MAX_BAR), 1);
  const radius = Math.min(4, barWidth / 2);
  const y = (value: number) => MARGIN.top + plotHeight - (value / top) * plotHeight;
  const labelEvery = Math.max(1, Math.ceil(labels.length / Math.max(Math.floor(plotWidth / 60), 1)));
  const baseline = MARGIN.top + plotHeight;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={ariaLabel} className="block" onPointerLeave={() => setActive(null)}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} stroke={GRID} />
              <text x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end" fontSize={11} fill={AXIS_TEXT} className="tabular-nums">
                {formatAxis(tick)}
              </text>
            </g>
          ))}
          {values.map((value, index) => {
            const center = MARGIN.left + band * index + band / 2;
            const left = center - barWidth / 2;
            const barTop = y(value);
            return (
              <g key={labels[index]} onPointerEnter={() => setActive(index)}>
                <rect x={MARGIN.left + band * index} y={MARGIN.top} width={band} height={plotHeight} fill="transparent" />
                <path
                  d={`M${left} ${baseline}V${barTop + radius}Q${left} ${barTop} ${left + radius} ${barTop}H${left + barWidth - radius}Q${left + barWidth} ${barTop} ${left + barWidth} ${barTop + radius}V${baseline}Z`}
                  fill={SERIES_COLORS[0]}
                  opacity={active === null || active === index ? 1 : 0.45}
                />
                {index % labelEvery === 0 && (
                  <text x={center} y={height - 6} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>
                    {labels[index]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
      {active !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-xl bg-ink-950 px-3 py-2 text-xs whitespace-nowrap text-white shadow-overlay"
          style={
            MARGIN.left + band * active > width / 2
              ? { right: width - (MARGIN.left + band * active) + 6 }
              : { left: MARGIN.left + band * (active + 1) + 6 }
          }
        >
          <p className="text-white/70">{labels[active]}</p>
          <p className="mt-0.5">
            <span className="text-white/80">{seriesLabel}</span>{" "}
            <span className="pl-2 font-semibold tabular-nums">{formatValue(values[active])}</span>
          </p>
        </div>
      )}
    </div>
  );
}

interface RankedBarsProps {
  items: { label: string; value: number }[];
  formatValue: (value: number) => string;
}

/** Horizontal ranked bars with the value at the tip. Plain HTML, so labels never clip. */
export function RankedBars({ items, formatValue }: RankedBarsProps) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label} className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-3 text-[0.8125rem]">
          <span className="truncate text-ink-600">{item.label}</span>
          <span className="flex items-center gap-2">
            <span className="h-3 rounded-r-[4px]" style={{ width: `${(item.value / max) * 78}%`, background: SERIES_COLORS[0] }} aria-hidden />
            <span className="font-medium whitespace-nowrap text-ink-800 tabular-nums">{formatValue(item.value)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
