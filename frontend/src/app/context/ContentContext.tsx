import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { defaultSiteContent } from '../data/defaultContent';
import type { Announcement, FAQCategory, FAQEntry, HomeContent, SiteContent } from '../types/content';
import { isFAQIcon } from '../utils/faqIcons';
import { useAuth } from './AuthContext';
import { apiRequest } from '../services/api';

interface CreateAnnouncementInput {
  date: string;
  category: string;
  priority: Announcement['priority'];
  title: string;
  description: string;
  details: string;
}

interface UpdateAnnouncementInput extends CreateAnnouncementInput {
  id: string;
}

interface FAQEntryInput {
  question: string;
  answer: string;
  imageUrl: string;
  videoUrl: string;
}

interface ContentContextValue {
  content: SiteContent;
  isLoading: boolean;
  error: string | null;
  updateHomeContent: (updates: Partial<HomeContent>) => void;
  updateFAQCategory: (
    categoryId: string,
    updates: Pick<FAQCategory, 'label' | 'description'>,
  ) => Promise<void>;
  createFAQEntry: (categoryId: string, entry: FAQEntryInput) => Promise<void>;
  updateFAQEntry: (categoryId: string, entryId: string, entry: FAQEntryInput) => Promise<void>;
  deleteFAQEntry: (categoryId: string, entryId: string) => Promise<void>;
  createAnnouncement: (announcement: CreateAnnouncementInput) => Promise<void>;
  updateAnnouncement: (announcement: UpdateAnnouncementInput) => Promise<void>;
  deleteAnnouncement: (announcementId: string) => Promise<void>;
  reload: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

interface ApiCategory {
  id: string;
  label: string;
  description: string;
}

interface ApiEntry {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface ApiAnnouncement {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    home: {
      ...defaultSiteContent.home,
      ...content.home,
    },
    faqCategories: (content.faqCategories ?? []).map((category) => ({
      ...category,
      icon: isFAQIcon(category.icon) ? category.icon : 'FileText',
      items: category.items ?? [],
    })),
    announcements: content.announcements ?? [],
  };
}

function toIsoDate(isoDateTime: string) {
  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

function toSiteContent(
  categories: ApiCategory[],
  entries: ApiEntry[],
  announcements: ApiAnnouncement[],
  currentHome: HomeContent,
): SiteContent {
  const fallbackCategory = defaultSiteContent.faqCategories[0];

  const faqCategories: FAQCategory[] = categories.map((category, index) => {
    const defaultCategory = defaultSiteContent.faqCategories[index] ?? fallbackCategory;
    const items: FAQEntry[] = entries
      .filter((entry) => entry.categoryId === category.id)
      .map((entry) => ({
        id: entry.id,
        question: entry.question,
        answer: entry.answer,
        imageUrl: entry.imageUrl ?? '',
        videoUrl: entry.videoUrl ?? '',
      }));

    return {
      id: category.id,
      label: category.label,
      description: category.description,
      summary: defaultCategory?.summary ?? '',
      icon: isFAQIcon(defaultCategory?.icon) ? defaultCategory.icon : 'FileText',
      items,
    };
  });

  const normalizedAnnouncements: Announcement[] = announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    description: announcement.description,
    details: '',
    category: 'Comunicado',
    priority: 'medium',
    date: toIsoDate(announcement.createdAt),
  }));

  return normalizeContent({
    home: currentHome,
    faqCategories,
    announcements: normalizedAnnouncements,
  });
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [content, setContent] = useState<SiteContent>(() => normalizeContent(defaultSiteContent));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRemoteContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [categories, entries, announcements] = await Promise.all([
        apiRequest<ApiCategory[]>('/faq/categories'),
        apiRequest<ApiEntry[]>('/faq/entries'),
        apiRequest<ApiAnnouncement[]>('/announcements'),
      ]);

      setContent((current) => toSiteContent(categories, entries, announcements, current.home));
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : 'Não foi possível carregar os dados do backend.';
      setError(message);
      setContent((current) => normalizeContent(current));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRemoteContent();
  }, [loadRemoteContent]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      isLoading,
      error,
      updateHomeContent: (updates) => {
        setContent((current) => ({
          ...current,
          home: {
            ...current.home,
            ...updates,
          },
        }));
      },
      updateFAQCategory: async (categoryId, updates) => {
        if (!token) {
          throw new Error('Faça login novamente para editar categorias.');
        }

        const updatedCategory = await apiRequest<ApiCategory>(`/faq/categories/${categoryId}`, {
          method: 'PATCH',
          token,
          body: JSON.stringify({
            label: updates.label.trim(),
            description: updates.description.trim(),
          }),
        });

        setContent((current) =>
          normalizeContent({
            ...current,
            faqCategories: current.faqCategories.map((category) =>
              category.id === categoryId
                ? {
                    ...category,
                    label: updatedCategory.label,
                    description: updatedCategory.description,
                  }
                : category,
            ),
          }),
        );
      },
      createFAQEntry: async (categoryId, entry) => {
        if (!token) {
          throw new Error('Faça login novamente para criar perguntas.');
        }

        const createdEntry = await apiRequest<ApiEntry>('/faq/entries', {
          method: 'POST',
          token,
          body: JSON.stringify({
            question: entry.question.trim(),
            answer: entry.answer.trim(),
            categoryId,
            imageUrl: entry.imageUrl.trim(),
            videoUrl: entry.videoUrl.trim(),
          }),
        });

        setContent((current) =>
          normalizeContent({
            ...current,
            faqCategories: current.faqCategories.map((category) =>
              category.id === categoryId
                ? {
                    ...category,
                    items: [
                      ...category.items,
                      {
                        id: createdEntry.id,
                        question: createdEntry.question,
                        answer: createdEntry.answer,
                        imageUrl: createdEntry.imageUrl ?? '',
                        videoUrl: createdEntry.videoUrl ?? '',
                      },
                    ],
                  }
                : category,
            ),
          }),
        );
      },
      updateFAQEntry: async (categoryId, entryId, entry) => {
        if (!token) {
          throw new Error('Faça login novamente para editar perguntas.');
        }

        const updatedEntry = await apiRequest<ApiEntry>(`/faq/entries/${entryId}`, {
          method: 'PATCH',
          token,
          body: JSON.stringify({
            question: entry.question.trim(),
            answer: entry.answer.trim(),
            categoryId,
            imageUrl: entry.imageUrl.trim(),
            videoUrl: entry.videoUrl.trim(),
          }),
        });

        setContent((current) =>
          normalizeContent({
            ...current,
            faqCategories: current.faqCategories.map((category) => ({
              ...category,
              items:
                category.id === categoryId
                  ? category.items.map((item) =>
                      item.id === entryId
                        ? {
                            ...item,
                            question: updatedEntry.question,
                            answer: updatedEntry.answer,
                            imageUrl: updatedEntry.imageUrl ?? '',
                            videoUrl: updatedEntry.videoUrl ?? '',
                          }
                        : item,
                    )
                  : category.items.filter((item) => item.id !== entryId),
            })),
          }),
        );
      },
      deleteFAQEntry: async (categoryId, entryId) => {
        if (!token) {
          throw new Error('Faça login novamente para remover perguntas.');
        }

        await apiRequest<void>(`/faq/entries/${entryId}`, {
          method: 'DELETE',
          token,
        });

        setContent((current) =>
          normalizeContent({
            ...current,
            faqCategories: current.faqCategories.map((category) =>
              category.id === categoryId
                ? {
                    ...category,
                    items: category.items.filter((item) => item.id !== entryId),
                  }
                : category,
            ),
          }),
        );
      },
      createAnnouncement: async (announcement) => {
        if (!token) {
          throw new Error('Faça login novamente para criar comunicados.');
        }

        const createdAnnouncement = await apiRequest<ApiAnnouncement>('/announcements', {
          method: 'POST',
          token,
          body: JSON.stringify({
            title: announcement.title.trim(),
            description: announcement.description.trim(),
          }),
        });

        setContent((current) =>
          normalizeContent({
            ...current,
            announcements: [
              ...current.announcements,
              {
                id: createdAnnouncement.id,
                title: createdAnnouncement.title,
                description: createdAnnouncement.description,
                details: '',
                category: 'Comunicado',
                priority: 'medium',
                date: toIsoDate(createdAnnouncement.createdAt),
              },
            ],
          }),
        );
      },
      updateAnnouncement: async ({ id, ...updates }) => {
        if (!token) {
          throw new Error('Faça login novamente para editar comunicados.');
        }

        const updatedAnnouncement = await apiRequest<ApiAnnouncement>(`/announcements/${id}`, {
          method: 'PATCH',
          token,
          body: JSON.stringify({
            title: updates.title.trim(),
            description: updates.description.trim(),
          }),
        });

        setContent((current) =>
          normalizeContent({
            ...current,
            announcements: current.announcements.map((announcement) =>
              announcement.id === id
                ? {
                    ...announcement,
                    title: updatedAnnouncement.title,
                    description: updatedAnnouncement.description,
                    date: toIsoDate(updatedAnnouncement.createdAt),
                  }
                : announcement,
            ),
          }),
        );
      },
      deleteAnnouncement: async (announcementId) => {
        if (!token) {
          throw new Error('Faça login novamente para remover comunicados.');
        }

        await apiRequest<void>(`/announcements/${announcementId}`, {
          method: 'DELETE',
          token,
        });

        setContent((current) =>
          normalizeContent({
            ...current,
            announcements: current.announcements.filter(
              (announcement) => announcement.id !== announcementId,
            ),
          }),
        );
      },
      reload: loadRemoteContent,
    }),
    [content, error, isLoading, loadRemoteContent, token],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }

  return context;
}
