'use client';

import { useState } from 'react';
import { MapPin, Clock, Tag, ExternalLink, Plus } from 'lucide-react';
import type { Attraction } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GlowButton } from '@/components/shared/GlowButton';

interface AttractionCardProps {
  attraction: Attraction;
  dayCount?: number;
  onAddToDay?: (day: number, attraction: Attraction) => void;
}

export function AttractionCard({ attraction, dayCount = 10, onAddToDay }: AttractionCardProps) {
  const [dayPickerOpen, setDayPickerOpen] = useState(false);

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden group transition-all duration-200 hover:border-[#00e5cc]/20"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Image placeholder */}
        <div className="h-40 bg-gradient-to-br from-[#1a1a28] to-[#0d0d15] flex items-center justify-center relative overflow-hidden">
          <span className="text-4xl opacity-40">🏙</span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="glass text-xs text-[#00e5cc] px-2 py-1 rounded-full capitalize">
              {attraction.category}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#00e5cc] transition-colors">
            {attraction.name}
          </h3>
          <p className="text-[#8888aa] text-xs line-clamp-2 mb-3">{attraction.description}</p>

          <div className="space-y-1.5 mb-3">
            {attraction.entryFee && (
              <div className="flex items-center gap-1.5 text-xs text-[#8888aa]">
                <Tag className="w-3 h-3 flex-shrink-0 text-[#ffd700]" />
                <span className="truncate">{attraction.entryFee}</span>
              </div>
            )}
            {attraction.openingHours && (
              <div className="flex items-center gap-1.5 text-xs text-[#8888aa]">
                <Clock className="w-3 h-3 flex-shrink-0 text-[#00e5cc]" />
                <span className="truncate">{attraction.openingHours}</span>
              </div>
            )}
          </div>

          {attraction.tipText && (
            <div className="glass rounded-lg p-2.5 mb-3">
              <p className="text-xs text-[#ffd700] line-clamp-3">💡 {attraction.tipText}</p>
            </div>
          )}

          <div className="flex gap-2">
            <a
              href={attraction.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-[#8888aa] hover:text-[#00e5cc] transition-colors glass rounded-lg py-2.5 min-h-[40px]"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              Map
            </a>
            {onAddToDay && (
              <button
                onClick={() => setDayPickerOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-[#00e5cc]/10 text-[#00e5cc] hover:bg-[#00e5cc]/20 rounded-lg py-2.5 min-h-[40px] transition-colors border border-[#00e5cc]/20"
              >
                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                Add to day
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dayPickerOpen} onOpenChange={setDayPickerOpen}>
        <DialogContent className="bg-[#12121a] border border-white/10 text-white w-[calc(100vw-2rem)] max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-sm">Add to which day?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
              <GlowButton
                key={day}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAddToDay?.(day, attraction);
                  setDayPickerOpen(false);
                }}
                className="aspect-square p-0 flex items-center justify-center text-sm min-h-[40px]"
              >
                {day}
              </GlowButton>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
