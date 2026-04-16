import { Church, Users, Heart, GraduationCap, UtensilsCrossed, Stethoscope, Sparkles, ArrowRight } from 'lucide-react';

const programs = [
  {
    Icon: Church,
    title: 'Church Ministries',
    description: 'Church programmes for spiritual nourishment and faith development for the whole community.',
    color: 'from-orange-500 to-pink-500',
    light: 'bg-orange-50',
    iconColor: 'text-orange-600',
    border: 'border-orange-100',
    tag: 'Spiritual',
    activities: ['Regular church services', 'Prayer meetings', 'Bible study sessions', 'Faith development programs'],
  },
  {
    Icon: Users,
    title: 'Women Ministries',
    description: 'Empowerment of women through leadership, skills development, and community engagement.',
    color: 'from-pink-500 to-rose-600',
    light: 'bg-pink-50',
    iconColor: 'text-pink-600',
    border: 'border-pink-100',
    tag: 'Empowerment',
    activities: ['Leadership training', 'Skills development', 'Resource management', 'Community engagement'],
  },
  {
    Icon: Sparkles,
    title: 'Youth Ministries',
    description: 'A programme targeting young people to discover their talents and lead with confidence.',
    color: 'from-purple-500 to-pink-600',
    light: 'bg-purple-50',
    iconColor: 'text-purple-600',
    border: 'border-purple-100',
    tag: 'Youth',
    activities: ['Talent development', 'Creative workshops', 'Leadership training', 'Innovation programs'],
  },
  {
    Icon: Heart,
    title: 'Children Ministries',
    description: 'A psychosocial support programme dedicated to the holistic wellbeing of every child.',
    color: 'from-rose-500 to-pink-600',
    light: 'bg-rose-50',
    iconColor: 'text-rose-600',
    border: 'border-rose-100',
    tag: 'Children',
    activities: ['Child development programs', 'Psychosocial support', 'Guidance and counselling', 'Child rights advocacy'],
  },
  {
    Icon: UtensilsCrossed,
    title: 'Food Security',
    description: 'Provision of daily nutritious meals and food security initiatives for orphaned children.',
    color: 'from-emerald-500 to-green-600',
    light: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    tag: 'Nutrition',
    activities: ['Daily nutritious meals', 'Food security initiatives', 'Nutrition education', 'Feeding programs'],
  },
  {
    Icon: GraduationCap,
    title: 'Education',
    description: 'Provision of comprehensive education support so every child can thrive academically.',
    color: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    tag: 'Education',
    activities: ['School fees payment', 'Uniforms and books', 'Educational materials', 'Academic support'],
  },
  {
    Icon: Stethoscope,
    title: 'Health',
    description: 'We provide guidance, counselling, and medical support to keep children healthy and strong.',
    color: 'from-cyan-500 to-blue-500',
    light: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    border: 'border-cyan-100',
    tag: 'Healthcare',
    activities: ['Medical treatment', 'Health education', 'Counselling services', 'Preventive care'],
  },
];

export default function ProgramsGrid() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-50 to-pink-50 rounded-full opacity-60 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            What We Do
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Seven pillars of care, each designed to nurture a different dimension of every child's life
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Featured first card — full width */}
        <div className="mb-6">
          {(() => {
            const { Icon, title, description, color, activities, tag } = programs[0];
            return (
              <div className={`group relative bg-gradient-to-br ${color} rounded-3xl p-10 overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 right-40 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-start gap-8">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-white/80 leading-relaxed">{description}</p>
                  </div>

                  {/* Right — activities */}
                  <div className="lg:w-64 flex-shrink-0">
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">Key Activities</p>
                    <ul className="space-y-2">
                      {activities.map((a) => (
                        <li key={a} className="flex items-center gap-2 text-white/90 text-sm">
                          <ArrowRight className="h-3.5 w-3.5 text-white/50 flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Remaining 6 in 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {programs.slice(1).map(({ Icon, title, description, color, light, iconColor, border, tag, activities }) => (
            <div
              key={title}
              className={`group relative bg-white border-2 ${border} rounded-2xl p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              {/* Hover gradient wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Left hover accent */}
              <div className={`absolute left-0 top-5 bottom-5 w-1 bg-gradient-to-b ${color} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-full`} />

              <div className="relative">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                      <span className={`text-[11px] font-semibold ${iconColor} ${light} px-2 py-0.5 rounded-full`}>
                        {tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-semibold">
                    Key Activities
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {activities.map((activity) => (
                      <li key={activity} className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} flex-shrink-0`} />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}