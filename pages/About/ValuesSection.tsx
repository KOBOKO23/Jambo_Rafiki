import { Heart, Shield, Eye, BookOpen, Scale, Star, Leaf } from 'lucide-react';

const values = [
  {
    name: 'Love',
    description: 'At the heart of everything we do',
    Icon: Heart,
    accent: 'from-rose-500 to-pink-500',
    light: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
  },
  {
    name: 'Patience',
    description: "Understanding each child's journey",
    Icon: Leaf,
    accent: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  {
    name: 'Honesty',
    description: 'Transparent in all our actions',
    Icon: Eye,
    accent: 'from-sky-500 to-blue-500',
    light: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-100',
  },
  {
    name: 'Accountability',
    description: 'Responsible stewardship of resources',
    Icon: Scale,
    accent: 'from-violet-500 to-purple-500',
    light: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-100',
  },
  {
    name: 'Transparency',
    description: 'Open communication with stakeholders',
    Icon: BookOpen,
    accent: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
  },
  {
    name: 'Integrity',
    description: 'Upholding our moral principles',
    Icon: Shield,
    accent: 'from-orange-500 to-pink-500',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
  },
  {
    name: 'Stewardship',
    description: 'Wise management of entrusted resources',
    Icon: Star,
    accent: 'from-pink-500 to-rose-500',
    light: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-100',
  },
];

export default function ValuesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            What We Stand For
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The principles that guide our work and relationships with children and the community
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Featured first value — Love — full width */}
        <div className="mb-6">
          <div className="group relative bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-10 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-8 right-32 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart className="h-8 w-8 text-white" fill="white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{values[0].name}</h3>
                <p className="text-white/80 text-base">{values[0].description}</p>
              </div>
              <div className="sm:ml-auto">
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full">
                  Our Foundation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining 6 values in a 3-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.slice(1).map(({ name, description, Icon, accent, light, text, border }) => (
            <div
              key={name}
              className={`group relative bg-white border-2 ${border} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              {/* Hover gradient wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />

              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 ${light} rounded-xl mb-5`}>
                  <Icon className={`h-6 w-6 ${text}`} />
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>

                {/* Bottom accent line on hover */}
                <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}