import {
  Train, CreditCard, Car, DollarSign, Wifi,
  Cloud, Banknote, Shield, MessageCircle,
} from 'lucide-react';
import type { PracticalInfo } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Train, CreditCard, Car, DollarSign, Wifi,
  Cloud, Banknote, Shield, MessageCircle,
};

const categoryColors: Record<PracticalInfo['category'], string> = {
  transport: '#00e5cc',
  money: '#ffd700',
  connectivity: '#a855f7',
  safety: '#10b981',
  culture: '#ff6eb4',
};

interface PracticalInfoCardProps {
  info: PracticalInfo;
}

export function PracticalInfoCard({ info }: PracticalInfoCardProps) {
  const Icon = iconMap[info.icon] ?? Shield;
  const color = categoryColors[info.category];

  const lines = info.content.split('\n').filter(Boolean);

  return (
    <div
      className="glass rounded-2xl p-5"
      style={{ border: `1px solid ${color}20` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="text-white font-semibold text-sm">{info.title}</h3>
      </div>

      <div className="space-y-1">
        {lines.map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={i} className="text-white font-medium text-xs mt-2">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-[#8888aa] mt-1 text-xs">•</span>
                <p
                  className="text-[#8888aa] text-xs"
                  dangerouslySetInnerHTML={{
                    __html: line
                      .slice(2)
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
                  }}
                />
              </div>
            );
          }
          return (
            <p
              key={i}
              className="text-[#8888aa] text-xs"
              dangerouslySetInnerHTML={{
                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
