const crew = [
  {
    initial: 'M',
    name: 'Matt',
    role: 'The Organiser',
    flavor: 'Has a spreadsheet for the spreadsheet',
    color: '#00e5cc',
  },
  {
    initial: 'S',
    name: 'Simmone',
    role: 'Passenger Princess',
    flavor: 'Seat reclined, snacks ready, not driving',
    color: '#ff6eb4',
  },
  {
    initial: 'E',
    name: 'Emma',
    role: 'Anxious Thrill Seeker',
    flavor: 'Nervous at the start, first in line by the end',
    color: '#ffd700',
  },
  {
    initial: 'S',
    name: 'Scott',
    role: 'Living His Best Life',
    flavor: 'Born for holidays, thriving every single day',
    color: '#a855f7',
  },
];

export function FamilyCrew() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {crew.map(({ initial, name, role, flavor, color }) => (
        <div
          key={name}
          className="glass rounded-2xl p-4 sm:p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-all duration-200"
          style={{ border: `1px solid ${color}22` }}
        >
          {/* Avatar */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl flex-shrink-0 transition-all duration-200 group-hover:scale-110"
            style={{
              background: `${color}18`,
              boxShadow: `0 0 0 1px ${color}33, 0 0 20px ${color}22`,
              color,
            }}
          >
            {initial}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm sm:text-base leading-tight">{name}</p>
            <p className="font-medium text-xs mt-0.5" style={{ color }}>{role}</p>
            <p className="text-[#555577] text-[10px] sm:text-xs mt-1.5 leading-snug italic">
              &ldquo;{flavor}&rdquo;
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
