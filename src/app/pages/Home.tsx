import { Calendar, Clock, DollarSign, FileText, HelpCircle, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useContent } from '../context/ContentContext';
import type { FAQIcon } from '../types/content';

export function Home() {
  const navigate = useNavigate();
  const {
    content: { announcements, faqCategories, home },
  } = useContent();

  const iconMap: Record<FAQIcon, typeof FileText> = {
    FileText,
    Clock,
    DollarSign,
    Calendar,
  };

  const colorMap: Record<FAQIcon, string> = {
    FileText: 'bg-blue-100 text-blue-600',
    Clock: 'bg-green-100 text-green-600',
    DollarSign: 'bg-violet-100 text-violet-600',
    Calendar: 'bg-orange-100 text-orange-600',
  };

  const recentAnnouncements = [...announcements]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 3);

  const formatDate = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl md:text-5xl">{home.heroTitle}</h1>
            <p className="mb-8 text-xl text-blue-100">{home.heroSubtitle}</p>
          </div>

          <SearchBar
            onSearch={(query) => {
              const trimmedQuery = query.trim();

              if (!trimmedQuery) {
                navigate('/faq');
                return;
              }

              navigate(`/faq?busca=${encodeURIComponent(trimmedQuery)}`);
            }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">{home.featuredTitle}</CardTitle>
            <CardDescription className="text-base text-gray-600">
              {home.featuredDescription}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl text-gray-900 md:text-3xl">{home.faqSectionTitle}</h2>
          <Link
            to="/faq"
            className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
          >
            Ver todas
            <HelpCircle className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faqCategories.map((category) => {
            const Icon = iconMap[category.icon];

            return (
              <Link key={category.id} to="/faq" className="group">
                <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div
                      className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${colorMap[category.icon]}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="transition-colors group-hover:text-blue-600">
                      {category.label}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl text-gray-900 md:text-3xl">
            {home.announcementsSectionTitle}
          </h2>
          <Link
            to="/comunicados"
            className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
          >
            Ver todos
            <FileText className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {recentAnnouncements.length > 0 ? (
            recentAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{formatDate(announcement.date)}</span>
                  </div>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <CardDescription>{announcement.description}</CardDescription>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-3">
              <CardContent className="pt-6 text-gray-600">
                Nenhum comunicado foi publicado até o momento.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="bg-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl text-gray-900 md:text-3xl">{home.chatbotTitle}</h2>
            <p className="text-gray-600">{home.chatbotDescription}</p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/chatbot"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg text-white shadow-lg transition-colors hover:bg-blue-700"
            >
              <MessageCircle className="h-6 w-6" />
              {home.chatbotButtonLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
