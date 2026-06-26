import type { AnnouncementPriority } from '../types/content';

export interface PriorityStyle {
  label: string;
  barClass: string;
  badgeClass: string;
}

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  high: 'Urgente',
  medium: 'Importante',
  low: 'Informativo',
};

export function getPriorityStyle(priority: AnnouncementPriority): PriorityStyle {
  switch (priority) {
    case 'high':
      return {
        label: ANNOUNCEMENT_PRIORITY_LABELS.high.toUpperCase(),
        barClass: 'bg-[#FF8C00]',
        badgeClass: 'bg-[#FF8C00] text-white',
      };
    case 'medium':
      return {
        label: ANNOUNCEMENT_PRIORITY_LABELS.medium.toUpperCase(),
        barClass: 'bg-[#007BFF]',
        badgeClass: 'bg-blue-100 text-blue-700',
      };
    case 'low':
      return {
        label: ANNOUNCEMENT_PRIORITY_LABELS.low.toUpperCase(),
        barClass: 'bg-[#28A745]',
        badgeClass: 'bg-green-100 text-green-700',
      };
  }
}

function parseDate(value: string) {
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateShort(value: string) {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return '--';
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateFull(value: string) {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return '--';
  }

  return parsedDate.toLocaleDateString('pt-BR');
}
