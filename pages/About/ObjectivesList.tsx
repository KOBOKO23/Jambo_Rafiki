import { ShieldCheck, Sparkles, Anchor, Church, Sunrise } from 'lucide-react';

const objectives = [
  {
    text: 'Provide basic needs to orphans and vulnerable children',
    Icon: ShieldCheck,
    accent: 'from-orange-500 to-pink-500',
    light: 'bg-orange-50',
    iconColor: 'text-orange-500',
    border: 'border-orange-100',
    label: 'Care',
  },
  {
    text: 'Strengthen the capacity of children to realize their potential',
    Icon: Sparkles,
    accent: 'from-violet-500 to-purple-500',
    light: 'bg-violet-50',
    iconColor: 'text-violet-500',
    border: 'border-violet-100',
    label: 'Potential',
  },
  {
    text: 'Build resilience in children facing adversity',
    Icon: Anchor,
    accent: 'from-sky-500 to-blue-500',
    light: 'bg-sky-50',
    iconColor: 'text-sky-500',
    border: 'border-sky-100',
    label: 'Resilience',
  },
  {
    text: 'Provide spiritual nourishment through community engagement',
    Icon: Church,
    accent: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    border: 'border-emerald-100',
    label: 'Spirit',
  },
  {
    text: 'Restore hope and dignity for the future',
    Icon: Sunrise,
    accent: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50',
    iconColor: 'text-amber-500',
    border: 'border-amber-100',
    label: 'Hope',
  },
];

export default function ObjectivesList() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            What We're Here to Do
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Objectives</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full" />
        </div>

        {/* Objectives */}
        <div className="space-y-4">
          {objectives.map(({ text, Icon, accent, light, iconColor, border, label }, index) => (
            <div
              key={index}
              className={`group relative flex items-center gap-6 bg-white border-2 ${border} rounded-2xl px-7 py-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
            >
              {/* Hover gradient wash */}
              <div className={`absolute inset-0 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Number + icon stack */}
              <div className="relative flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className={`w-12 h-12 ${light} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <span className="text-xs font-bold text-gray-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Divider */}
              <div className={`flex-shrink-0 w-px h-12 bg-gradient-to-b ${accent} opacity-20`} />

              {/* Text + label */}
              <div className="relative flex-1 min-w-0">
                <p className="text-gray-700 leading-relaxed text-base">{text}</p>
              </div>

              {/* Label pill — desktop only */}
              <div className="relative flex-shrink-0 hidden sm:block">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${light} ${iconColor}`}>
                  {label}
                </span>
              </div>

              {/* Left accent bar on hover */}
              <div className={`absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b ${accent} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-full`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}