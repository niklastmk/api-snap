"use client";

interface TimelineDay {
  date: string; // YYYY-MM-DD
  label: string; // "Mar 24"
  count: number;
}

export function ScanTimeline({ days }: { days: TimelineDay[] }) {
  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1 h-32">
      {days.map((day) => {
        const height = Math.max((day.count / max) * 100, day.count > 0 ? 4 : 0);
        return (
          <div
            key={day.date}
            className="flex-1 flex flex-col items-center justify-end gap-1 group relative"
          >
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {day.count} scan{day.count !== 1 ? "s" : ""} &middot; {day.label}
            </div>
            {/* Bar */}
            <div
              className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              style={{ height: `${height}%`, minHeight: day.count > 0 ? "3px" : "0" }}
            />
            {/* Label — show every other for space */}
            <span className="text-[10px] text-zinc-400 leading-none hidden sm:block">
              {day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
