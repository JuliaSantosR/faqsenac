import { Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useContent } from '../context/ContentContext';
import type { FAQCategory, FAQIcon } from '../types/content';

export function FAQ() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('busca') ?? '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const {
    content: { faqCategories },
  } = useContent();
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]?.id ?? '');

  const iconMap: Record<FAQIcon, typeof FileText> = {
    FileText,
    Clock,
    DollarSign,
    Calendar,
  };

  useEffect(() => {
    if (!faqCategories.find((category) => category.id === activeCategory)) {
      setActiveCategory(faqCategories[0]?.id ?? '');
    }
  }, [activeCategory, faqCategories]);

  const filteredCategories = useMemo<FAQCategory[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return faqCategories;
    }

    return faqCategories.map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        [category.label, category.description, item.question, item.answer]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    }));
  }, [faqCategories, searchQuery]);

  const resultsCount = filteredCategories.reduce((total, category) => total + category.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-3 text-center text-3xl text-gray-900 md:text-4xl">
            Perguntas Frequentes
          </h1>
          <p className="mb-8 text-center text-gray-600">
            Encontre respostas para as dúvidas mais comuns
          </p>

          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query);

              const trimmedQuery = query.trim();
              if (!trimmedQuery) {
                setSearchParams({});
                return;
              }

              setSearchParams({ busca: trimmedQuery });
            }}
          />

          {searchQuery.trim() ? (
            <p className="mt-4 text-center text-sm text-gray-500">
              {resultsCount} resultado(s) encontrados para "{searchQuery.trim()}".
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="mb-8 grid h-auto w-full grid-cols-2 md:grid-cols-4">
            {filteredCategories.map((category) => {
              const Icon = iconMap[category.icon];

              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 py-3"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {filteredCategories.map((category) => {
            const Icon = iconMap[category.icon];

            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl text-gray-900">
                    <Icon className="h-6 w-6 text-blue-600" />
                    {category.label}
                  </h2>
                  <p className="mb-6 text-gray-600">{category.description}</p>

                  {category.items.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="rounded-lg border px-6"
                        >
                          <AccordionTrigger className="py-4 text-left hover:no-underline">
                            <span className="font-medium text-gray-900">{item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 text-gray-600">
                            <p className="mb-4">{item.answer}</p>

                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt="Ilustração"
                                className="mb-4 h-auto max-w-full rounded-lg"
                              />
                            ) : null}

                            {item.videoUrl ? (
                              <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                                <iframe
                                  src={item.videoUrl}
                                  title="Vídeo explicativo"
                                  className="h-full w-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : null}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-gray-500">
                      Nenhuma pergunta encontrada nesta categoria.
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="mt-12 rounded-lg bg-blue-50 p-8 text-center">
          <h3 className="mb-3 text-xl text-gray-900">Não encontrou o que procura?</h3>
          <p className="mb-6 text-gray-600">
            Entre em contato conosco ou utilize o chatbot para ajuda personalizada.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/chatbot"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Falar com Chatbot
            </Link>
            <a
              href="mailto:contato@instituicao.edu.br"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-900 transition-colors hover:bg-gray-50"
            >
              Enviar E-mail
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
