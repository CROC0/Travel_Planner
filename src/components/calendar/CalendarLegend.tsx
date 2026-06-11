export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#8888aa] mt-4">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#00e5cc]/40 border border-[#00e5cc] shrink-0" />
        Trip day (no activities)
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#00e5cc] shrink-0" style={{ boxShadow: '0 0 6px #00e5cc' }} />
        Trip day (activities planned)
      </div>
    </div>
  );
}
