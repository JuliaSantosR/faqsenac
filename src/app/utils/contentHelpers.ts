import type { AnnouncementPriority } from '../types/content';

export interface PriorityStyle {
  label: string;
  barClass: string;
  badgeClass: string;
}

export function getPriorityStyle(priority: AnnouncementPriority): PriorityStyle {
  switch (priority) {
    case 'high':
      return {
        label: 'URGENTE',
        barClass: 'bg-[#FF8C00]',
        badgeClass: 'bg-[#FF8C00] text-white',
      };
    case 'medium':
      return {
        label: 'INFORMATIVO',
        barClass: 'bg-[#007BFF]',
        badgeClass: 'bg-blue-100 text-blue-700',
      };
    case 'low':
      return {
        label: 'NOVO',
        barClass: 'bg-[#28A745]',
        badgeClass: 'bg-green-100 text-green-700',
      };
  }
}

export function formatDateShort(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateFull(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR');
}
