import { defaultSiteContent } from '../data/defaultContent';
import type { SiteContent } from '../types/content';
import { isFAQIcon } from '../utils/faqIcons';

export const CONTENT_STORAGE_KEY = 'unifaq-content';

export function normalizeContent(content: SiteContent): SiteContent {
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

export function loadStoredContent(): SiteContent {
  if (typeof window === 'undefined') {
    return normalizeContent(defaultSiteContent);
  }

  try {
    const rawValue = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!rawValue) {
      return normalizeContent(defaultSiteContent);
    }

    const parsed = JSON.parse(rawValue) as SiteContent;
    return normalizeContent(parsed);
  } catch {
    return normalizeContent(defaultSiteContent);
  }
}

export function saveStoredContent(content: SiteContent): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(normalizeContent(content)));
  } catch {
    // noop: storage indisponível não deve quebrar o app
  }
}

export function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
