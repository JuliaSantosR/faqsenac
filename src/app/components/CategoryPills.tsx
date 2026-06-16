import type { FAQCategory } from '../types/content';
import { getFAQIcon, getFAQIconAccent } from '../utils/faqIcons';

interface CategoryPillsProps {
  categories: FAQCategory[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
  getItemCount?: (category: FAQCategory) => number;
}

export function CategoryPills({
  categories,
  activeCategoryId,
  onSelect,
  getItemCount,
}: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const Icon = getFAQIcon(category.icon);
        const isActive = category.id === activeCategoryId;
        const count = getItemCount ? getItemCount(category) : category.items.length;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-[#004581] bg-white text-[#004581] shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon
              className={`h-4 w-4 ${isActive ? 'text-[#004581]' : getFAQIconAccent(category.icon)}`}
            />
            <span>
              {category.label} ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
