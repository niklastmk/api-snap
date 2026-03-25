"use client";

import { useState } from "react";

interface TimelineDay {
  date: string; // YYYY-MM-DD
  label: string; // "Mar 24"
  count: number;
}

export function ScanTimeline({ days }: { days: TimelineDay[] }) {
  const max = Math.max(...days.map((d) => d.count), 1);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  // On mobile, show every Nth label to avoid overlap
  const labelInterval = days.length > 14 ? 3 : days.length > 7 ? 2 : 1;

  return (
    <div>
      {/* Active day info bar */}
      <div className="h-5 mb-2 text-center">
        {activeDay !== null && days[activeDay] && (
          <span className="text-xs text-zinc-600 font-medium">
            {days[activeDay].label}: {days[activeDay].count} scan{days[activeDay].count !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div
        className="flex items-end gap-[2px] sm:gap-1 h-28 sm:h-32"
        onMouseLeave={() => setActiveDay(null)}
      >
        {days.map((day, idx) => {
          const height = Math.max((day.count / max) * 100, day.count > 0 ? 4 : 0);
          const isActive = activeDay === idx;
          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center justify-end gap-1 cursor-pointer"
              onMouseEnter={() => setActiveDay(idx)}
              onTouchStart={() => setActiveDay(idx)}
            >
              {/* Bar */}
              <div
                className={`w-full rounded-t transition-colors ${isActive ? "bg-blue-600" : "bg-blue-400"}`}
                style={{ height: `${height}%`, minHeight: day.count > 0 ? "3px" : "0" }}
              />
            </div>
          );
        })}
      </div>
      {/* Date labels below the chart */}
      <div className="flex gap-[2px] sm:gap-1 mt-1">
        {days.map((day, idx) => (
          <div key={day.date} className="flex-1 text-center">
            {idx % labelInterval === 0 && (
              <span className="text-[9px] sm:text-[10px] text-zinc-400 leading-none">
                {day.label.split(" ")[1]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
