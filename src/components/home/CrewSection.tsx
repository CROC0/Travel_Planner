import type { CrewMember } from '@/types';

const DEFAULT_COLOR = '#00e5cc';

export function CrewSection({ crew }: { crew?: CrewMember[] }) {
  if (!crew || crew.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {crew.map((member) => {
        const color = member.color ?? DEFAULT_COLOR;
        const initial = member.name.charAt(0).toUpperCase();
        return (
          <div
            key={member.id}
            className="glass rounded-2xl p-4 sm:p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-all duration-200"
            style={{ border: `1px solid ${color}22` }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl flex-shrink-0 transition-all duration-200 group-hover:scale-110"
              style={{ background: `${color}18`, boxShadow: `0 0 0 1px ${color}33, 0 0 20px ${color}22`, color }}
            >
              {member.emoji ?? initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm sm:text-base leading-tight">{member.name}</p>
              <p className="font-medium text-xs mt-0.5" style={{ color }}>{member.role}</p>
              {member.tagline && (
                <p className="text-[#555577] text-[10px] sm:text-xs mt-1.5 leading-snug italic">
                  &ldquo;{member.tagline}&rdquo;
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
