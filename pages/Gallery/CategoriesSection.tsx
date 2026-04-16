// pages/Gallery/CategoriesSection.tsx
import { BookOpen, Calendar, Heart, Images, Users } from 'lucide-react';

type CategoryItem = {
  id: string;
  slug?: string;
  name: string;
  description: string;
  count: number;
};

type CategoriesSectionProps = {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  loading?: boolean;
};

const ICONS = [Images, Users, Heart, BookOpen, Calendar];
const COLORS = [
  'from-orange-500 to-pink-500',
  'from-pink-500 to-rose-500',
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-purple-500 to-fuchsia-500',
];

export default function CategoriesSection({
  categories,
  selectedCategory,
  onSelectCategory,
  loading = false,
}: CategoriesSectionProps) {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            Explore
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Browse by Category</h2>
          <p className="text-gray-500">Explore moments from every part of life at Jambo Rafiki</p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* Category cards */}
        {loading && categories.length === 0 && (
          <div className="text-center text-sm text-gray-500 mb-6">Loading categories...</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat, index) => {
            const Icon = ICONS[index % ICONS.length];
            const color = COLORS[index % COLORS.length];
            const isSelected = selectedCategory === (cat.slug ?? cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug ?? cat.id)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient background */}
                <div className={`bg-gradient-to-br ${color} p-7 flex flex-col items-center text-center relative overflow-hidden ${isSelected ? 'ring-4 ring-orange-300/70' : ''}`}>
                  {/* Decorative circle */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />

                  {/* Icon */}
                  <div className="relative w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Text */}
                  <h3 className="text-white font-bold text-base mb-1">{cat.name}</h3>
                  <p className="text-white/75 text-xs mb-4 leading-relaxed">{cat.description}</p>

                  {/* Count pill */}
                  <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
                    {cat.count} photos
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}