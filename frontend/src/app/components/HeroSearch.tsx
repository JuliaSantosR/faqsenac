import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSearchProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoSearch?: boolean;
  debounceMs?: number;
}

export function HeroSearch({
  defaultValue = '',
  onSearch,
  placeholder = 'Ex: Quais documentos levar? Como calcular renda?',
  className = '',
  autoSearch = false,
  debounceMs = 350,
}: HeroSearchProps) {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!autoSearch) {
      return;
    }

    const timer = window.setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [autoSearch, debounceMs, onSearch, query]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`mx-auto w-full max-w-3xl ${className}`}>
      <div className="relative flex flex-col gap-2 sm:block">
        <Search className="pointer-events-none absolute top-4 left-5 h-5 w-5 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border-0 bg-white py-4 pr-5 pl-12 text-base text-gray-900 shadow-lg placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none sm:pr-32"
          aria-label="Buscar"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover sm:absolute sm:top-1/2 sm:right-2 sm:w-auto sm:-translate-y-1/2"
        >
          {autoSearch ? 'Buscar agora' : 'Buscar'}
        </button>
      </div>
    </form>
  );
}
