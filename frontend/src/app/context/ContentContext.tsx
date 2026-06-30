import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Announcement, FAQCategory, FAQEntry, HomeContent, SiteContent } from '../types/content';
import {
  CONTENT_STORAGE_KEY,
  createId,
  loadStoredContent,
  normalizeContent,
  saveStoredContent,
} from '../services/contentStorage';
import { useAuth } from './AuthContext';

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

function requireAuth(token: string | null) {
  if (!token) {
    throw new Error('Faça login novamente para editar o conteúdo.');
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [content, setContent] = useState<SiteContent>(() => loadStoredContent());

  useEffect(() => {
    saveStoredContent(content);
  }, [content]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CONTENT_STORAGE_KEY) {
        setContent(loadStoredContent());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const reload = useCallback(async () => {
    setContent(loadStoredContent());
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      isLoading: false,
      error: null,
      updateHomeContent: (updates) => {
        requireAuth(token);
        setContent((current) =>
          normalizeContent({
            ...current,
            home: {
              ...current.home,
              ...updates,
            },
          }),
        );
      },
      updateFAQCategory: async (categoryId, updates) => {
        requireAuth(token);

        setContent((current) =>
          normalizeContent({
            ...current,
            faqCategories: current.faqCategories.map((category) =>
              category.id === categoryId
                ? {
                    ...category,
                    label: updates.label.trim(),
                    description: updates.description.trim(),
                  }
                : category,
            ),
          }),
        );
      },
      createFAQEntry: async (categoryId, entry) => {
        requireAuth(token);

        const newEntry: FAQEntry = {
          id: createId('faq'),
          question: entry.question.trim(),
          answer: entry.answer.trim(),
          imageUrl: entry.imageUrl.trim(),
          videoUrl: entry.videoUrl.trim(),
        };

        setContent((current) =>
          normalizeContent({
            ...current,
            faqCategories: current.faqCategories.map((category) =>
              category.id === categoryId
                ? {
                    ...category,
                    items: [...category.items, newEntry],
                  }
                : category,
            ),
          }),
        );
      },
      updateFAQEntry: async (categoryId, entryId, entry) => {
        requireAuth(token);

        setContent((current) =>
          normalizeContent({
            ...current,
            faqCategories: current.faqCategories.map((category) =>
              category.id === categoryId
                ? {
                    ...category,
                    items: category.items.map((item) =>
                      item.id === entryId
                        ? {
                            ...item,
                            question: entry.question.trim(),
                            answer: entry.answer.trim(),
                            imageUrl: entry.imageUrl.trim(),
                            videoUrl: entry.videoUrl.trim(),
                          }
                        : item,
                    ),
                  }
                : category,
            ),
          }),
        );
      },
      deleteFAQEntry: async (categoryId, entryId) => {
        requireAuth(token);

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
        requireAuth(token);

        const newAnnouncement: Announcement = {
          id: createId('announcement'),
          date: announcement.date,
          category: announcement.category.trim(),
          priority: announcement.priority,
          title: announcement.title.trim(),
          description: announcement.description.trim(),
          details: announcement.details.trim(),
        };

        setContent((current) =>
          normalizeContent({
            ...current,
            announcements: [...current.announcements, newAnnouncement],
          }),
        );
      },
      updateAnnouncement: async ({ id, ...updates }) => {
        requireAuth(token);

        setContent((current) =>
          normalizeContent({
            ...current,
            announcements: current.announcements.map((announcement) =>
              announcement.id === id
                ? {
                    ...announcement,
                    date: updates.date,
                    category: updates.category.trim(),
                    priority: updates.priority,
                    title: updates.title.trim(),
                    description: updates.description.trim(),
                    details: updates.details.trim(),
                  }
                : announcement,
            ),
          }),
        );
      },
      deleteAnnouncement: async (announcementId) => {
        requireAuth(token);

        setContent((current) =>
          normalizeContent({
            ...current,
            announcements: current.announcements.filter(
              (announcement) => announcement.id !== announcementId,
            ),
          }),
        );
      },
      reload,
    }),
    [content, reload, token],
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
