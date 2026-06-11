'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlowButton } from '@/components/shared/GlowButton';
import type { AddActivityFormValues, ActivityCategory } from '@/types';

const categories: ActivityCategory[] = [
  'sightseeing', 'food', 'transport', 'accommodation',
  'shopping', 'nature', 'nightlife', 'beach', 'culture', 'free',
];

const emptyForm = (): AddActivityFormValues => ({
  title: '',
  location: '',
  startTime: '',
  endTime: '',
  category: 'sightseeing',
  notes: '',
  emoji: '',
  googleMapsUrl: '',
});

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: AddActivityFormValues) => void;
  day: number;
  initial?: Partial<AddActivityFormValues>;
  mode?: 'add' | 'edit';
}

export function AddActivityModal({ open, onClose, onSave, day, initial, mode = 'add' }: AddActivityModalProps) {
  const [form, setForm] = useState<AddActivityFormValues>({ ...emptyForm(), ...initial });

  function set(field: keyof AddActivityFormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    setForm(emptyForm());
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#12121a] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === 'edit' ? 'Edit activity' : `Add activity — Day ${day}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="flex gap-2">
            <Input
              placeholder="Emoji (optional)"
              value={form.emoji}
              onChange={(e) => set('emoji', e.target.value)}
              className="w-24 bg-white/5 border-white/10 text-white placeholder-[#8888aa]"
              maxLength={2}
            />
            <Input
              placeholder="Activity title *"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              autoFocus
              className="flex-1 bg-white/5 border-white/10 text-white placeholder-[#8888aa]"
            />
          </div>

          <Input
            placeholder="Location"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-[#8888aa]"
          />

          <div className="flex gap-2">
            <Input
              type="time"
              value={form.startTime}
              onChange={(e) => set('startTime', e.target.value)}
              className="flex-1 bg-white/5 border-white/10 text-white"
            />
            <Input
              type="time"
              value={form.endTime}
              onChange={(e) => set('endTime', e.target.value)}
              className="flex-1 bg-white/5 border-white/10 text-white"
            />
          </div>

          <Select value={form.category} onValueChange={(v) => v && set('category', v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#12121a] border-white/10 text-white">
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="capitalize hover:bg-white/10 focus:bg-white/10">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-[#8888aa] resize-none"
            rows={2}
          />

          <Input
            placeholder="Google Maps URL (optional)"
            value={form.googleMapsUrl}
            onChange={(e) => set('googleMapsUrl', e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-[#8888aa]"
          />

          <div className="flex gap-2 pt-1">
            <GlowButton variant="ghost" type="button" onClick={onClose} className="flex-1">
              Cancel
            </GlowButton>
            <GlowButton variant="teal" type="submit" className="flex-1" disabled={!form.title.trim()}>
              {mode === 'edit' ? 'Save changes' : 'Add activity'}
            </GlowButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
