import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defaultSiteContent } from '../data/defaultContent';
import type { Announcement, FAQCategory, FAQEntry, HomeContent, SiteContent } from '../types/content';

const CONTENT_STORAGE_KEY = 'school-help-center-content';

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
  updateHomeContent: (updates: Partial<HomeContent>) => void;
  updateFAQCategory: (categoryId: string, updates: Pick<FAQCategory, 'label' | 'description'>) => void;
  createFAQEntry: (categoryId: string, entry: FAQEntryInput) => void;
  updateFAQEntry: (categoryId: string, entryId: string, entry: FAQEntryInput) => void;
  deleteFAQEntry: (categoryId: string, entryId: string) => void;
  createAnnouncement: (announcement: CreateAnnouncementInput) => void;
  updateAnnouncement: (announcement: UpdateAnnouncementInput) => void;
  deleteAnnouncement: (announcementId: string) => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function readStoredContent(): SiteContent {
  if (typeof window === 'undefined') {
    return defaultSiteContent;
  }

  const rawValue = window.localStorage.getItem(CONTENT_STORAGE_KEY);

  if (!rawValue) {
    return defaultSiteContent;
  }

  try {
    return JSON.parse(rawValue) as SiteContent;
  } catch {
    window.localStorage.removeItem(CONTENT_STORAGE_KEY);
    return defaultSiteContent;
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => readStoredContent());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      updateHomeContent: (updates) => {
        setContent((current) => ({
          ...current,
          home: {
            ...current.home,
            ...updates,
          },
        }));
      },
      updateFAQCategory: (categoryId, updates) => {
        setContent((current) => ({
          ...current,
          faqCategories: current.faqCategories.map((category) =>
            category.id === categoryId ? { ...category, ...updates } : category,
          ),
        }));
      },
      createFAQEntry: (categoryId, entry) => {
        const newEntry: FAQEntry = {
          id: createId(categoryId),
          ...entry,
        };

        setContent((current) => ({
          ...current,
          faqCategories: current.faqCategories.map((category) =>
            category.id === categoryId
              ? { ...category, items: [...category.items, newEntry] }
              : category,
          ),
        }));
      },
      updateFAQEntry: (categoryId, entryId, entry) => {
        setContent((current) => ({
          ...current,
          faqCategories: current.faqCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  items: category.items.map((item) =>
                    item.id === entryId ? { ...item, ...entry } : item,
                  ),
                }
              : category,
          ),
        }));
      },
      deleteFAQEntry: (categoryId, entryId) => {
        setContent((current) => ({
          ...current,
          faqCategories: current.faqCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  items: category.items.filter((item) => item.id !== entryId),
                }
              : category,
          ),
        }));
      },
      createAnnouncement: (announcement) => {
        setContent((current) => ({
          ...current,
          announcements: [
            ...current.announcements,
            {
              id: createId('announcement'),
              ...announcement,
            },
          ],
        }));
      },
      updateAnnouncement: ({ id, ...updates }) => {
        setContent((current) => ({
          ...current,
          announcements: current.announcements.map((announcement) =>
            announcement.id === id ? { ...announcement, ...updates } : announcement,
          ),
        }));
      },
      deleteAnnouncement: (announcementId) => {
        setContent((current) => ({
          ...current,
          announcements: current.announcements.filter(
            (announcement) => announcement.id !== announcementId,
          ),
        }));
      },
    }),
    [content],
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
