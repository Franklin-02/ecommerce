import { useEffect, useRef, useState } from "react";

/** Validated with the dataviz palette checker against the white chart surface. */
export const SERIES_COLORS = ["#3343e8", "#eb6834", "#1baf7a", "#eda100"];

export const GRID = "#e4e7ef";
export const AXIS_TEXT = "#5f6a85";

/** Rounds a maximum up to a clean axis top, returning evenly spaced ticks from 0. */
export function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0, 1];
  const rough = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const residual = rough / magnitude;
  const step = (residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1) * magnitude;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step);
}

/** Tracks an element's width so charts draw at true pixel size and text never scales. */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}
