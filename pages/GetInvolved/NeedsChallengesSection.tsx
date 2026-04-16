import { HandHeart, AlertCircle, Flame, Minus, Clock } from 'lucide-react';

const needs = [
  { item: 'Food supplies for daily meals', priority: 'High' },
  { item: 'School fees and educational materials', priority: 'High' },
  { item: 'Clothing and shoes for 30 children', priority: 'High' },
  { item: 'Medical supplies and healthcare', priority: 'High' },
  { item: 'Bedding and shelter improvements', priority: 'Medium' },
  { item: 'Playing materials and recreational equipment', priority: 'Medium' },
  { item: 'Transportation van', priority: 'Medium' },
  { item: 'Income-generating project setup (poultry, dairy)', priority: 'Long-term' },
];

const challenges = [
  'Limited resources despite high demand for registration',
  'Need for expanded facilities to accommodate 100 children',
  'Sustainable funding for daily operations',
  'Transportation for children\'s needs',
  'Income-generating projects for long-term sustainability',
];

const PRIORITY = {
  High: {
    label: 'High',
    Icon: Flame,
    pill: 'bg-rose-50 text-rose-600 border border-rose-100',
    dot: 'bg-rose-500',
  },
  Medium: {
    label: 'Medium',
    Icon: Minus,
    pill: 'bg-amber-50 text-amber-600 border border-amber-100',
    dot: 'bg-amber-400',
  },
  'Long-term': {
    label: 'Long-term',
    Icon: Clock,
    pill: 'bg-sky-50 text-sky-600 border border-sky-100',
    dot: 'bg-sky-400',
  },
} as const;

export default function NeedsChallengesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
      <div className="absolute -top-28 -right-28 w-80 h-80 bg-gradient-to-br from-orange-50 to-pink-50 rounded-full opacity-50 pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            Where Support Is Needed
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Needs & Challenges</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Understanding what we need most helps you know exactly where your support will make the biggest difference.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Current Needs ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <HandHeart className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Current Needs</h3>
                <p className="text-sm text-gray-400">What we need most right now</p>
              </div>
            </div>

            {/* Priority legend */}
            <div className="flex items-center gap-3 mb-5">
              {Object.values(PRIORITY).map(({ label, dot }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {label}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {needs.map(({ item, priority }) => {
                const p = PRIORITY[priority as keyof typeof PRIORITY];
                return (
                  <div
                    key={item}
                    className="group relative flex items-center justify-between gap-4 bg-white border-2 border-orange-50 rounded-2xl px-5 py-4 hover:border-orange-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover wash */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />

                    {/* Left accent */}
                    <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${p.dot} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center`} />

                    <div className="relative flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dot}`} />
                      <span className="text-gray-700 text-sm leading-snug">{item}</span>
                    </div>

                    <span className={`relative flex-shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full ${p.pill}`}>
                      {priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Challenges ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Challenges We Face</h3>
                <p className="text-sm text-gray-400">Understanding our obstacles</p>
              </div>
            </div>

            {/* Spacer to align with legend row on left */}
            <div className="mb-5 h-[28px]" />

            <div className="space-y-3">
              {challenges.map((challenge, index) => (
                <div
                  key={challenge}
                  className="group relative flex items-start gap-4 bg-white border-2 border-purple-50 rounded-2xl px-5 py-5 hover:border-purple-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover wash */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />

                  {/* Left accent */}
                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                  {/* Number */}
                  <span className="relative flex-shrink-0 w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-xs font-bold text-purple-500 group-hover:bg-purple-100 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="relative text-gray-600 text-sm leading-relaxed pt-0.5">{challenge}</p>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-5 text-white">
              <p className="text-sm font-semibold mb-1">Every contribution helps</p>
              <p className="text-white/80 text-xs leading-relaxed">
                Whether financial, material, or in prayer — your support directly addresses these challenges and changes a child's future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}