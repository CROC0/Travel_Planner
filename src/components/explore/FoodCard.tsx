'use client';

import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import type { FoodSpot } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GlowButton } from '@/components/shared/GlowButton';

const categoryEmojis: Record<FoodSpot['category'], string> = {
  hawker: '🥢',
  'fine-dining': '🍷',
  cafe: '☕',
  bar: '🍸',
  dessert: '🍰',
};

const priceColors: Record<FoodSpot['priceRange'], string> = {
  '$': '#22c55e',
  '$$': '#ffd700',
  '$$$': '#f97316',
  '$$$$': '#ff6eb4',
};

interface FoodCardProps {
  spot: FoodSpot;
  onAddToDay?: (day: number, spot: FoodSpot) => void;
}

export function FoodCard({ spot, onAddToDay }: FoodCardProps) {
  const [dayPickerOpen, setDayPickerOpen] = useState(false);

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden group transition-all duration-200 hover:border-[#ffd700]/20"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="h-36 bg-gradient-to-br from-[#1a1a12] to-[#0d0d0a] flex items-center justify-center relative">
          <span className="text-5xl">{categoryEmojis[spot.category]}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="glass text-xs text-[#ffd700] px-2 py-1 rounded-full capitalize">
              {spot.category}
            </span>
            <span className="text-xs font-bold" style={{ color: priceColors[spot.priceRange] }}>
              {spot.priceRange}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-0.5 group-hover:text-[#ffd700] transition-colors">
            {spot.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 text-[#8888aa]" />
            <p className="text-[#8888aa] text-xs">{spot.location}</p>
          </div>
          <p className="text-[#8888aa] text-xs line-clamp-2 mb-3">{spot.description}</p>

          {spot.mustTry.length > 0 && (
            <div className="mb-3">
              <p className="text-[#ffd700] text-xs font-medium mb-1">Must try:</p>
              <div className="flex flex-wrap gap-1">
                {spot.mustTry.map((item) => (
                  <span key={item} className="text-xs glass px-2 py-0.5 rounded-full text-[#8888aa]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <a
              href={spot.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-[#8888aa] hover:text-[#ffd700] transition-colors glass rounded-lg py-2"
            >
              <MapPin className="w-3.5 h-3.5" />
              Map
            </a>
            {onAddToDay && (
              <button
                onClick={() => setDayPickerOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-[#ffd700]/10 text-[#ffd700] hover:bg-[#ffd700]/20 rounded-lg py-2 transition-colors border border-[#ffd700]/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to day
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dayPickerOpen} onOpenChange={setDayPickerOpen}>
        <DialogContent className="bg-[#12121a] border border-white/10 text-white max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-white text-sm">Add to which day?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
              <GlowButton
                key={day}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAddToDay?.(day, spot);
                  setDayPickerOpen(false);
                }}
                className="aspect-square p-0 flex items-center justify-center text-sm"
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
