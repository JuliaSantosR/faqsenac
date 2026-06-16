import { Search } from 'lucide-react';
import { useState } from 'react';

interface HeroSearchProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function HeroSearch({
  defaultValue = '',
  onSearch,
  placeholder = 'Ex: Quais documentos levar? Como calcular renda?',
  className = '',
}: HeroSearchProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`mx-auto w-full max-w-3xl ${className}`}>
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border-0 bg-white py-4 pr-32 pl-12 text-base text-gray-900 shadow-lg placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          aria-label="Buscar"
        />
        <button
          type="submit"
          className="absolute right-2 rounded-full bg-[#FF8C00] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e67e00]"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
