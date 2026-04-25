// TrustIndicators.tsx
import { ShieldCheck, Users, Clock, Heart } from 'lucide-react';

const indicators = [
  {
    Icon: ShieldCheck,
    stat: '100%',
    label: 'Transparent',
    sub: 'Every shilling is fully accounted for and reported.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    ring: 'ring-blue-100',
  },
  {
    Icon: Users,
    stat: '30+',
    label: 'Children Supported',
    sub: 'Orphaned children receiving daily care and education.',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    ring: 'ring-orange-100',
  },
  {
    Icon: Clock,
    stat: '24 / 7',
    label: 'Care Provided',
    sub: 'Round-the-clock support, protection, and love.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    ring: 'ring-purple-100',
  },
  {
    Icon: Heart,
    stat: '5+',
    label: 'Years of Impact',
    sub: 'Building brighter futures since our founding.',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    ring: 'ring-pink-100',
  },
];

export function TrustIndicators() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">Why Trust Us</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Accountability you can count on
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {indicators.map(({ Icon, stat, label, sub, color, bg, ring }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-2xl border border-white bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md text-center"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ring-1 ${ring} mb-4`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <p className={`text-3xl font-extrabold ${color}`}>{stat}</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}