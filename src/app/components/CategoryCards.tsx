import { Link } from 'react-router';
import type { FAQCategory } from '../types/content';
import { getFAQIcon, getFAQIconColor } from '../utils/faqIcons';

interface CategoryCardsProps {
  categories: FAQCategory[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <div
      id="categorias"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {categories.map((category) => {
        const Icon = getFAQIcon(category.icon);

        return (
          <Link
            key={category.id}
            to={`/faq?categoria=${category.id}`}
            className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition-shadow hover:shadow-lg"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${getFAQIconColor(category.icon)}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-base font-bold text-gray-900 group-hover:text-[#004581]">
              {category.label}
            </h3>
            <p className="text-sm leading-snug text-gray-500">
              {category.summary ?? category.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
