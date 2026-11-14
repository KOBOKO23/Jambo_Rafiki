// pages/Gallery/CategoriesSection.tsx
// Sticky filter bar with one chip per gallery category.

type CategoryItem = {
  id: string;
  name: string;
  count: number;
};

type CategoriesSectionProps = {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  loading?: boolean;
};

export default function CategoriesSection({
  categories,
  selectedCategory,
  onSelectCategory,
  loading = false,
}: CategoriesSectionProps) {
  return (
    <div className="sticky top-20 z-30 border-y border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          role="tablist"
          aria-label="Filter photos by category"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.name}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                    isSelected ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}

          {loading &&
            categories.length <= 1 &&
            [0, 1, 2].map((i) => (
              <span key={i} className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-gray-100" aria-hidden="true" />
            ))}
        </div>
      </div>
    </div>
  );
}
