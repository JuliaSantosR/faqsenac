import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Announcement } from '../types/content';
import { AnnouncementCard } from './AnnouncementCard';

interface AnnouncementFeedProps {
  announcements: Announcement[];
  title: string;
  limit?: number;
}

export function AnnouncementFeed({
  announcements,
  title,
  limit = 2,
}: AnnouncementFeedProps) {
  const recentAnnouncements = [...announcements]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, limit);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          to="/comunicados"
          className="flex items-center gap-1 text-sm font-semibold text-[#004581] hover:text-[#003560]"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {recentAnnouncements.length > 0 ? (
          recentAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              variant="compact"
            />
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
            Nenhum comunicado foi publicado até o momento.
          </p>
        )}
      </div>
    </section>
  );
}
