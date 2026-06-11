'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Activity, DayPlan, AddActivityFormValues } from '@/types';
import { ActivityItem } from './ActivityItem';
import { AddActivityModal } from './AddActivityModal';

interface DayTimelineProps {
  dayPlan: DayPlan;
  onAdd: (form: AddActivityFormValues) => void;
  onUpdate: (id: string, form: Partial<AddActivityFormValues>) => void;
  onDelete: (id: string) => void;
}

export function DayTimeline({ dayPlan, onAdd, onUpdate, onDelete }: DayTimelineProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Activity | null>(null);

  return (
    <div>
      {dayPlan.activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-2xl">
            📍
          </div>
          <p className="text-[#8888aa] text-sm">No activities yet</p>
          <button
            onClick={() => setAddOpen(true)}
            className="text-[#00e5cc] text-sm hover:underline"
          >
            Add your first activity
          </button>
        </div>
      )}

      <div className="relative">
        {dayPlan.activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onEdit={setEditTarget}
            onDelete={onDelete}
          />
        ))}
      </div>

      {dayPlan.activities.length > 0 && (
        <button
          onClick={() => setAddOpen(true)}
          className="mt-2 flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#00e5cc] transition-colors group"
        >
          <div className="w-7 h-7 rounded-full border border-dashed border-white/20 group-hover:border-[#00e5cc]/50 flex items-center justify-center transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
          Add activity
        </button>
      )}

      <AddActivityModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={onAdd}
        day={dayPlan.day}
        mode="add"
      />

      <AddActivityModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(form) => {
          if (editTarget) onUpdate(editTarget.id, form);
        }}
        day={dayPlan.day}
        initial={editTarget ?? undefined}
        mode="edit"
      />
    </div>
  );
}
