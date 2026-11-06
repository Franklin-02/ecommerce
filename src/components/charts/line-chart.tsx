"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { AXIS_TEXT, GRID, SERIES_COLORS, niceTicks, useElementWidth } from "./chart-utils";

export interface LineSeries {
  label: string;
  values: number[];
}

interface LineChartProps {
  labels: string[];
  series: LineSeries[];
  ariaLabel: string;
  height?: number;
  formatAxis: (value: number) => string;
  formatValue: (value: number) => string;
  /** Shades under the first series. Use only for a single series. */
  area?: boolean;
}

const MARGIN = { top: 10, right: 12, bottom: 24, left: 46 };

/** Line or area chart with a crosshair tooltip, usable by pointer and keyboard. */
export function LineChart({ labels, series, ariaLabel, height = 260, formatAxis, formatValue, area = false }: LineChartProps) {
  const [containerRef, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const plotHeight = height - MARGIN.top - MARGIN.bottom;
  const ticks = niceTicks(Math.max(...series.flatMap((line) => line.values)));
  const top = ticks[ticks.length - 1];
  const last = Math.max(labels.length - 1, 1);

  const x = (index: number) => MARGIN.left + (index / last) * plotWidth;
  const y = (value: number) => MARGIN.top + plotHeight - (value / top) * plotHeight;
  const path = (values: number[]) => values.map((value, index) => `${index ? "L" : "M"}${x(index)} ${y(value)}`).join("");

  const labelEvery = Math.max(1, Math.ceil(labels.length / Math.max(Math.floor(plotWidth / 72), 1)));

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left - MARGIN.left) / Math.max(plotWidth, 1);
    setActive(Math.min(Math.max(Math.round(ratio * last), 0), labels.length - 1));
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    setActive((index) => Math.min(Math.max((index ?? labels.length) + delta, 0), labels.length - 1));
  };

  const tooltipOnLeft = active !== null && x(active) > width / 2;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel}
          tabIndex={0}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
          className="block touch-pan-y"
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} stroke={GRID} />
              <text x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end" fontSize={11} fill={AXIS_TEXT} className="tabular-nums">
                {formatAxis(tick)}
              </text>
            </g>
          ))}
          {labels.map((label, index) =>
            index % labelEvery === 0 ? (
              <text key={label} x={x(index)} y={height - 6} textAnchor={index === 0 ? "start" : "middle"} fontSize={11} fill={AXIS_TEXT}>
                {label}
              </text>
            ) : null,
          )}
          {area && series[0] && (
            <path
              d={`${path(series[0].values)}L${x(labels.length - 1)} ${y(0)}L${x(0)} ${y(0)}Z`}
              fill={SERIES_COLORS[0]}
              opacity={0.1}
            />
          )}
          {series.map((line, index) => (
            <path key={line.label} d={path(line.values)} fill="none" stroke={SERIES_COLORS[index]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {active !== null && (
            <>
              <line x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={MARGIN.top + plotHeight} stroke="#8a93a8" />
              {series.map((line, index) => (
                <circle key={line.label} cx={x(active)} cy={y(line.values[active])} r={4.5} fill={SERIES_COLORS[index]} stroke="#fff" strokeWidth={2} />
              ))}
            </>
          )}
        </svg>
      )}
      {active !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-xl bg-ink-950 px-3 py-2 text-xs whitespace-nowrap text-white shadow-overlay"
          style={tooltipOnLeft ? { right: width - x(active) + 10 } : { left: x(active) + 10 }}
        >
          <p className="mb-1 text-white/70">{labels[active]}</p>
          {series.map((line, index) => (
            <p key={line.label} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: SERIES_COLORS[index] }} aria-hidden />
              <span className="text-white/80">{line.label}</span>
              <span className="ml-auto pl-3 font-semibold tabular-nums">{formatValue(line.values[active])}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
