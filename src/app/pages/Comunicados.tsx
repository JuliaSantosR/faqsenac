import { Megaphone } from 'lucide-react';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { useContent } from '../context/ContentContext';

export function Comunicados() {
  const {
    content: { announcements },
  } = useContent();

  const sortedAnnouncements = [...announcements].sort((left, right) =>
    right.date.localeCompare(left.date),
  );

  return (
    <div className="min-h-screen bg-brand-surface">
      <section className="bg-brand-primary px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase">
            <Megaphone className="h-4 w-4" />
            Mural de avisos
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">Comunicados</h1>
          <p className="text-base leading-relaxed text-blue-100">
            Avisos oficiais sobre editais, matrículas, documentação e prazos do Programa Senac de
            Gratuidade.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {sortedAnnouncements.length > 0 ? (
            sortedAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} variant="full" />
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
              Nenhum comunicado oficial foi publicado até o momento.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
