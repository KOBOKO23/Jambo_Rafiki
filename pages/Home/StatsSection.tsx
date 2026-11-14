import { BadgeCheck, Heart, Home, MapPin } from 'lucide-react';

// Facts stated elsewhere on the site (About / Get Involved). Kept static so the
// home page never shows "0" while the CMS is being populated.
const FACTS = [
  { value: '30', label: 'Children in our care', detail: 'Food, schooling, healthcare and a safe home', icon: Heart },
  { value: '100', label: 'Children we are building for', detail: 'Our goal for a fully equipped home', icon: Home },
  { value: 'Registered', label: 'With the Government of Kenya', detail: 'Department of Social Services', icon: BadgeCheck },
  { value: 'Oyugis', label: 'Rooted in our community', detail: 'Church and children’s centre in Kenya', icon: MapPin },
];

export default function StatsSection() {
  return (
    <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8" aria-label="Jambo Rafiki at a glance">
      <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5 lg:grid-cols-4">
        {FACTS.map(({ value, label, detail, icon: Icon }, i) => (
          <div
            key={label}
            className={`flex flex-col gap-1 p-5 sm:p-7 ${i % 2 === 1 ? 'border-l border-gray-100' : ''} ${
              i >= 2 ? 'border-t border-gray-100 lg:border-t-0' : ''
            } ${i === 2 ? 'lg:border-l' : ''}`}
          >
            <Icon className="mb-2 h-5 w-5 text-orange-600" aria-hidden="true" />
            <p className="font-display text-2xl font-semibold text-gray-900 sm:text-3xl">{value}</p>
            <p className="text-sm font-medium text-gray-800">{label}</p>
            <p className="hidden text-xs leading-relaxed text-gray-500 sm:block">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
