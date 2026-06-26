import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { CategoryPills } from '../components/CategoryPills';
import { HeroSearch } from '../components/HeroSearch';
import { SupportStrip } from '../components/SupportStrip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useContent } from '../context/ContentContext';
import type { FAQCategory } from '../types/content';
import { getSafeVideoUrl } from '../utils/faqMediaHelpers';

export function FAQ() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('busca') ?? '';
  const initialCategory = searchParams.get('categoria') ?? '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const {
    content: { faqCategories },
  } = useContent();

  const [activeCategory, setActiveCategory] = useState(
    faqCategories.find((category) => category.id === initialCategory)?.id ??
      faqCategories[0]?.id ??
      '',
  );

  useEffect(() => {
    if (initialCategory && faqCategories.find((category) => category.id === initialCategory)) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, faqCategories]);

  useEffect(() => {
    if (!faqCategories.find((category) => category.id === activeCategory)) {
      setActiveCategory(faqCategories[0]?.id ?? '');
    }
  }, [activeCategory, faqCategories]);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

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

  const hasActiveSearch = searchQuery.trim().length > 0;

  const activeCategoryData = useMemo(() => {
    const baseCategory =
      faqCategories.find((category) => category.id === activeCategory) ?? faqCategories[0];

    if (!baseCategory) {
      return undefined;
    }

    if (!hasActiveSearch) {
      return baseCategory;
    }

    return (
      filteredCategories.find((category) => category.id === activeCategory) ?? {
        ...baseCategory,
        items: [],
      }
    );
  }, [activeCategory, faqCategories, filteredCategories, hasActiveSearch]);

  const activeCategoryResultsCount = activeCategoryData?.items.length ?? 0;

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setSearchParams(activeCategory ? { categoria: activeCategory } : {});
        return;
      }

      const params: Record<string, string> = { busca: trimmedQuery };
      if (activeCategory) {
        params.categoria = activeCategory;
      }
      setSearchParams(params);
    },
    [activeCategory, setSearchParams],
  );

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    const params: Record<string, string> = { categoria: categoryId };
    if (searchQuery.trim()) {
      params.busca = searchQuery.trim();
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <section className="bg-brand-primary px-4 pt-12 pb-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Perguntas Frequentes</h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-blue-100">
            Encontre respostas sobre o Programa Senac de Gratuidade. Busque por palavra-chave ou
            navegue pelas categorias.
          </p>

          <HeroSearch
            defaultValue={initialQuery}
            onSearch={handleSearch}
            autoSearch
            placeholder="Buscar: renda, edital, documentos..."
          />

          {hasActiveSearch ? (
            <p className="mt-4 text-sm text-blue-200">
              {activeCategoryResultsCount} resultado(s) encontrados na categoria ativa para
              &ldquo;{searchQuery.trim()}&rdquo;.
            </p>
          ) : null}
        </div>

        <div className="relative z-10 mx-auto -mb-6 mt-10 max-w-5xl px-4">
          <CategoryPills
            categories={faqCategories}
            activeCategoryId={activeCategory}
            onSelect={handleCategorySelect}
            getItemCount={(category) => {
              if (!hasActiveSearch) {
                return category.items.length;
              }

              return (
                filteredCategories.find((filteredCategory) => filteredCategory.id === category.id)
                  ?.items.length ?? 0
              );
            }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {activeCategoryData ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">{activeCategoryData.label}</h2>
            <p className="mb-8 text-gray-500">{activeCategoryData.description}</p>

            {activeCategoryData.items.length > 0 ? (
              <Accordion type="single" collapsible>
                {activeCategoryData.items.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <AccordionTrigger className="py-5 text-left text-base font-medium text-gray-900 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      <p className="mb-4">{item.answer}</p>

                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt="Ilustração"
                          className="mb-4 h-auto max-w-full rounded-lg"
                        />
                      ) : null}

                      {item.videoUrl ? (
                        (() => {
                          const safeVideoUrl = getSafeVideoUrl(item.videoUrl);
                          if (!safeVideoUrl) {
                            return null;
                          }

                          return (
                        <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                          <iframe
                            src={safeVideoUrl}
                            title="Vídeo explicativo"
                            className="h-full w-full"
                            sandbox="allow-scripts allow-same-origin allow-presentation"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                          );
                        })()
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-500">
                Nenhuma pergunta encontrada nesta categoria.
              </div>
            )}
          </div>
        ) : null}

        <SupportStrip />
      </section>
    </div>
  );
}
