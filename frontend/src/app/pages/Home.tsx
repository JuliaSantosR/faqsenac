import { useNavigate } from 'react-router';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { CategoryCards } from '../components/CategoryCards';
import { HeroSearch } from '../components/HeroSearch';
import { SupportWidget } from '../components/SupportWidget';
import { HOME_FEATURED_IMAGE } from '../constants/site';
import { useContent } from '../context/ContentContext';

export function Home() {
  const navigate = useNavigate();
  const {
    content: { announcements, faqCategories, home },
  } = useContent();

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      navigate('/faq');
      return;
    }

    navigate(`/faq?busca=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <section className="bg-brand-primary px-4 pt-12 pb-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">{home.heroTitle}</h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-blue-100 md:text-lg">
            {home.heroSubtitle}
          </p>
          <HeroSearch onSearch={handleSearch} />
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryCards categories={faqCategories} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnnouncementFeed
              announcements={announcements}
              title={home.announcementsSectionTitle}
              limit={2}
            />
          </div>

          <div className="space-y-6">
            <SupportWidget />
            <img
              src={HOME_FEATURED_IMAGE}
              alt="Estudante em ambiente de aprendizagem do Senac"
              className="w-full rounded-2xl object-cover shadow-sm"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
