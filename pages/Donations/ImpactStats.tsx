// ImpactStats.tsx
import { Heart, Gift, HandHeart, ArrowRight } from 'lucide-react';

const impactStories = [
  {
    Icon: Heart,
    title: 'Nourish a Child',
    amount: 1000,
    impact: 'Feeds one child for a full week',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    Icon: Gift,
    title: 'Empower Learning',
    amount: 5000,
    impact: 'School supplies for an entire term',
    color: 'from-orange-500 to-pink-600',
  },
  {
    Icon: HandHeart,
    title: 'Heal & Protect',
    amount: 10000,
    impact: 'Medical care for one child',
    color: 'from-purple-500 to-pink-600',
  },
];

export function ImpactStats({ onSelectAmount }: { onSelectAmount?: (amount: number) => void }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-14 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">Real Impact</p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 lg:text-4xl">
            Your Donation at Work
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500">
            Every shilling you give goes directly to transforming a child's life.
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {impactStories.map(({ Icon, title, amount, impact, color }) => (
            <button
              key={title}
              type="button"
              onClick={() => onSelectAmount?.(amount)}
              className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-8 text-left transition-all duration-300 hover:border-transparent hover:shadow-2xl"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />
              <div className="relative space-y-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className={`text-3xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  KES {amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{impact}</p>
                <div className="flex translate-x-0 items-center gap-1 text-xs font-semibold text-orange-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  Donate this amount <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}