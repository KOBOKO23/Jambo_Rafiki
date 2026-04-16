// ─── ImpactStats ────────────────────────────────────────────────────────────

import { Heart, Gift, HandHeart, ArrowRight } from 'lucide-react';

const impactStories = [
  {
    Icon: Heart,
    title: 'Education Transforms',
    amount: 1000,
    impact: 'Feeds one child for a week',
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    Icon: Gift,
    title: 'Learning Empowers',
    amount: 5000,
    impact: 'School supplies for one term',
    color: 'from-orange-500 to-pink-600',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    Icon: HandHeart,
    title: 'Health Matters',
    amount: 10000,
    impact: 'Medical care for one child',
    color: 'from-purple-500 to-pink-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
];

export function ImpactStats({ onSelectAmount }: { onSelectAmount?: (amount: number) => void }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            Real Impact
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Your Donation at Work</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Every shilling you give goes directly to transforming a child's life.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactStories.map(({ Icon, title, amount, impact, color }) => (
            <button
              key={title}
              onClick={() => onSelectAmount?.(amount)}
              className="group relative text-left bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />

              <div className="relative space-y-4">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

                {/* Amount */}
                <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  KES {amount.toLocaleString()}
                </div>

                {/* Impact */}
                <p className="text-sm text-gray-500">{impact}</p>

                {/* CTA hint */}
                <div className="flex items-center gap-1 text-xs font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1 group-hover:translate-x-0">
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