'use client';

import { useState } from 'react';
import { Trash2, Pencil, MapPin, Clock, ExternalLink } from 'lucide-react';
import type { Activity, ActivityCategory } from '@/types';
import { cn } from '@/lib/utils';

const categoryColors: Record<ActivityCategory, string> = {
  sightseeing: '#00e5cc',
  food: '#ffd700',
  transport: '#8888aa',
  accommodation: '#10b981',
  shopping: '#ff6eb4',
  nature: '#22c55e',
  nightlife: '#a855f7',
  beach: '#3b82f6',
  culture: '#f97316',
  free: '#64748b',
};

const categoryEmojis: Record<ActivityCategory, string> = {
  sightseeing: '👁',
  food: '🍜',
  transport: '🚇',
  accommodation: '🏨',
  shopping: '🛍',
  nature: '🌿',
  nightlife: '🌃',
  beach: '🏖',
  culture: '🎭',
  free: '✨',
};

interface ActivityItemProps {
  activity: Activity;
  onEdit?: (a: Activity) => void;
  onDelete?: (id: string) => void;
}

export function ActivityItem({ activity, onEdit, onDelete }: ActivityItemProps) {
  const [hovering, setHovering] = useState(false);
  const color = categoryColors[activity.category];
  const emoji = activity.emoji ?? categoryEmojis[activity.category];

  return (
    <div
      className="flex gap-3 group"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-1">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
        />
        <div className="w-px flex-1 bg-white/10 mt-1" />
      </div>

      {/* Card */}
      <div
        className="flex-1 glass rounded-xl p-3 sm:p-4 mb-3 transition-all duration-200"
        style={{
          borderLeft: `2px solid ${color}`,
          boxShadow: hovering ? `0 0 20px ${color}15` : 'none',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="text-lg flex-shrink-0">{emoji}</span>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{activity.title}</p>
              {activity.location && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#8888aa] flex-shrink-0" />
                  <p className="text-[#8888aa] text-xs truncate">{activity.location}</p>
                </div>
              )}
              {(activity.startTime || activity.endTime) && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-[#8888aa] flex-shrink-0" />
                  <p className="text-[#8888aa] text-xs">
                    {activity.startTime}{activity.endTime ? ` – ${activity.endTime}` : ''}
                  </p>
                </div>
              )}
              {activity.notes && (
                <p className="text-[#8888aa] text-xs mt-1 line-clamp-2">{activity.notes}</p>
              )}
            </div>
          </div>

          <div className={cn('flex items-center gap-1 transition-opacity opacity-100 sm:opacity-0', hovering && 'sm:opacity-100')}>
            {activity.googleMapsUrl && (
              <a
                href={activity.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#8888aa] hover:text-[#00e5cc] transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(activity)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#8888aa] hover:text-[#ffd700] transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(activity.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#8888aa] hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
