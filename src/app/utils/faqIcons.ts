import {
  Calendar,
  ClipboardList,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { FAQIcon } from '../types/content';

export const FAQ_ICONS: FAQIcon[] = [
  'FileText',
  'Clock',
  'DollarSign',
  'Calendar',
  'FileCheck',
  'ClipboardList',
  'Users',
];

export const FAQ_ICON_MAP: Record<FAQIcon, LucideIcon> = {
  FileText,
  Clock,
  DollarSign,
  Calendar,
  FileCheck,
  ClipboardList,
  Users,
};

export const FAQ_ICON_COLORS: Record<FAQIcon, string> = {
  FileText: 'bg-orange-100 text-orange-600',
  Clock: 'bg-green-100 text-green-600',
  DollarSign: 'bg-blue-100 text-blue-600',
  Calendar: 'bg-orange-100 text-orange-600',
  FileCheck: 'bg-green-100 text-green-600',
  ClipboardList: 'bg-violet-100 text-violet-600',
  Users: 'bg-pink-100 text-pink-600',
};

export const FAQ_ICON_ACCENT: Record<FAQIcon, string> = {
  FileText: 'text-orange-600',
  Clock: 'text-green-600',
  DollarSign: 'text-blue-600',
  Calendar: 'text-orange-600',
  FileCheck: 'text-green-600',
  ClipboardList: 'text-violet-600',
  Users: 'text-pink-600',
};

export function isFAQIcon(value: unknown): value is FAQIcon {
  return typeof value === 'string' && FAQ_ICONS.includes(value as FAQIcon);
}

export function getFAQIcon(icon: unknown): LucideIcon {
  return isFAQIcon(icon) ? FAQ_ICON_MAP[icon] : FileText;
}

export function getFAQIconColor(icon: unknown): string {
  return isFAQIcon(icon) ? FAQ_ICON_COLORS[icon] : FAQ_ICON_COLORS.FileText;
}

export function getFAQIconAccent(icon: unknown): string {
  return isFAQIcon(icon) ? FAQ_ICON_ACCENT[icon] : FAQ_ICON_ACCENT.FileText;
}
