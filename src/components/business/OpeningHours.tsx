'use client';

import { OpeningHours as OpeningHoursType } from '@/types/business';
import { Clock } from 'lucide-react';

interface OpeningHoursProps {
  hours: OpeningHoursType;
}

const dayNames: Record<string, string> = {
  monday: 'Bazar ertəsi',
  tuesday: 'Çərşənbə axşamı',
  wednesday: 'Çərşənbə',
  thursday: 'Cümə axşamı',
  friday: 'Cümə',
  saturday: 'Şənbə',
  sunday: 'Bazar',
};

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function getCurrentDayKey(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

export default function OpeningHours({ hours }: OpeningHoursProps) {
  const hasAnyHours = dayOrder.some((day) => hours[day as keyof OpeningHoursType]);
  if (!hasAnyHours) return null;

  const today = getCurrentDayKey();

  return (
    <section className="px-5 animate-fade-in-up delay-500" style={{ opacity: 0 }}>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Clock className="h-3.5 w-3.5" />
        İş saatları
      </h2>
      <div className="rounded-xl bg-white border border-gray-100/80 card-shadow overflow-hidden">
        {dayOrder.map((day) => {
          const time = hours[day as keyof OpeningHoursType];
          if (!time) return null;
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`flex items-center justify-between px-4 py-2.5 text-sm
                         ${isToday ? 'bg-amber-50/60 font-semibold' : ''}
                         border-b border-gray-50 last:border-b-0`}
            >
              <span className={isToday ? 'text-gray-900' : 'text-gray-600'}>
                {dayNames[day]}
                {isToday && (
                  <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">
                    Bu gün
                  </span>
                )}
              </span>
              <span className={isToday ? 'text-gray-900' : 'text-gray-500'}>
                {time}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
