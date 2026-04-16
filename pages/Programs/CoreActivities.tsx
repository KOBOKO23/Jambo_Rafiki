import { Church, UtensilsCrossed, Shirt, GraduationCap, Gamepad2, Home, Tent, HeartHandshake, Scale, TrendingUp } from 'lucide-react';

const coreActivities = [
  {
    text: 'Church services for spiritual growth',
    Icon: Church,
    accent: 'from-violet-500 to-purple-600',
    light: 'bg-violet-50',
    iconColor: 'text-violet-500',
    border: 'border-violet-100',
    tag: 'Spiritual',
  },
  {
    text: 'Daily feeding program for orphaned children',
    Icon: UtensilsCrossed,
    accent: 'from-orange-500 to-pink-500',
    light: 'bg-orange-50',
    iconColor: 'text-orange-500',
    border: 'border-orange-100',
    tag: 'Nutrition',
  },
  {
    text: 'Clothing distribution to orphans',
    Icon: Shirt,
    accent: 'from-pink-500 to-rose-500',
    light: 'bg-pink-50',
    iconColor: 'text-pink-500',
    border: 'border-pink-100',
    tag: 'Clothing',
  },
  {
    text: 'Educational support for school-going children',
    Icon: GraduationCap,
    accent: 'from-sky-500 to-blue-600',
    light: 'bg-sky-50',
    iconColor: 'text-sky-500',
    border: 'border-sky-100',
    tag: 'Education',
  },
  {
    text: 'Provision of playing materials and recreational activities',
    Icon: Gamepad2,
    accent: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    border: 'border-emerald-100',
    tag: 'Recreation',
  },
  {
    text: 'Improving shelter and bedding conditions',
    Icon: Home,
    accent: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    tag: 'Shelter',
  },
  {
    text: 'Organizing bonding camps for children',
    Icon: Tent,
    accent: 'from-teal-500 to-emerald-600',
    light: 'bg-teal-50',
    iconColor: 'text-teal-500',
    border: 'border-teal-100',
    tag: 'Community',
  },
  {
    text: 'Professional guidance and counselling services',
    Icon: HeartHandshake,
    accent: 'from-rose-500 to-pink-600',
    light: 'bg-rose-50',
    iconColor: 'text-rose-500',
    border: 'border-rose-100',
    tag: 'Counselling',
  },
  {
    text: 'Child rights advocacy and protection',
    Icon: Scale,
    accent: 'from-indigo-500 to-violet-600',
    light: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    border: 'border-indigo-100',
    tag: 'Advocacy',
  },
  {
    text: 'Income generating activity projects',
    Icon: TrendingUp,
    accent: 'from-green-500 to-emerald-600',
    light: 'bg-green-50',
    iconColor: 'text-green-600',
    border: 'border-green-100',
    tag: 'Livelihoods',
  },
];

export default function CoreActivities() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
      <div className="absolute -top-28 -left-28 w-80 h-80 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            How We Serve
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Program Activities</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Daily operations and activities that make a real difference in children's lives
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreActivities.map(({ text, Icon, accent, light, iconColor, border, tag }, index) => (
            <div
              key={index}
              className={`group relative flex items-center gap-5 bg-white border-2 ${border} rounded-2xl px-6 py-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
            >
              {/* Hover wash */}
              <div className={`absolute inset-0 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Left accent bar */}
              <div className={`absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b ${accent} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-full`} />

              {/* Icon */}
              <div className={`relative flex-shrink-0 flex flex-col items-center gap-1.5`}>
                <div className={`w-11 h-11 ${light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <span className="text-[10px] font-bold text-gray-300 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Divider */}
              <div className={`flex-shrink-0 w-px h-10 bg-gradient-to-b ${accent} opacity-20`} />

              {/* Text */}
              <p className="relative flex-1 text-gray-700 text-sm leading-relaxed">{text}</p>

              {/* Tag pill */}
              <div className="relative flex-shrink-0 hidden sm:block">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${light} ${iconColor}`}>
                  {tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}