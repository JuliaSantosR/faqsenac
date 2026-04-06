export type FAQIcon = 'FileText' | 'Clock' | 'DollarSign' | 'Calendar';

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  imageUrl: string;
  videoUrl: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  description: string;
  icon: FAQIcon;
  items: FAQEntry[];
}

export type AnnouncementPriority = 'high' | 'medium' | 'low';

export interface Announcement {
  id: string;
  date: string;
  category: string;
  priority: AnnouncementPriority;
  title: string;
  description: string;
  details: string;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  featuredTitle: string;
  featuredDescription: string;
  faqSectionTitle: string;
  announcementsSectionTitle: string;
  chatbotTitle: string;
  chatbotDescription: string;
  chatbotButtonLabel: string;
}

export interface SiteContent {
  home: HomeContent;
  faqCategories: FAQCategory[];
  announcements: Announcement[];
}
