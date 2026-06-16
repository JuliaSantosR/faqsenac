import { Calendar } from 'lucide-react';
import type { Announcement } from '../types/content';
import {
  formatDateFull,
  formatDateShort,
  getPriorityStyle,
} from '../utils/contentHelpers';

interface AnnouncementCardProps {
  announcement: Announcement;
  variant?: 'compact' | 'full';
}

export function AnnouncementCard({ announcement, variant = 'full' }: AnnouncementCardProps) {
  const style = getPriorityStyle(announcement.priority);
  const formattedDate =
    variant === 'compact'
      ? formatDateShort(announcement.date)
      : formatDateFull(announcement.date);

  return (
    <article className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className={`w-1.5 flex-shrink-0 ${style.barClass}`} aria-hidden="true" />

      <div className="flex-1 p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${style.badgeClass}`}
            >
              {style.label}
            </span>
            {variant === 'full' ? (
              <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                {announcement.category}
              </span>
            ) : null}
          </div>

          <time
            dateTime={announcement.date}
            className="flex items-center gap-1.5 text-sm text-gray-400"
          >
            {variant === 'full' ? <Calendar className="h-4 w-4" /> : null}
            {formattedDate}
          </time>
        </div>

        <h3 className="mb-2 text-lg font-bold text-gray-900">{announcement.title}</h3>
        <p className="text-gray-600">{announcement.description}</p>

        {variant === 'full' && announcement.details ? (
          <p className="mt-3 text-gray-600">{announcement.details}</p>
        ) : null}
      </div>
    </article>
  );
}
