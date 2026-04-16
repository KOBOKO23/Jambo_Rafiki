import { DollarSign, Gift, UserPlus, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ways = [
  {
    Icon: DollarSign,
    title: 'Financial Donations',
    description: 'Your financial support helps us provide food, education, healthcare, and shelter to 30 children in our care.',
    color: 'from-orange-500 to-pink-500',
    light: 'bg-orange-50',
    iconColor: 'text-orange-600',
    border: 'border-orange-100',
    tag: 'Donate',
    ctaLabel: 'Donate Now',
    to: '/donations?method=card&amount=1000#donation-form',
    actions: ['One-time donation', 'Monthly sponsorship', 'Sponsor a child', 'General fund'],
  },
  {
    Icon: Gift,
    title: 'Material Donations',
    description: 'We welcome donations of clothing, books, school supplies, bedding, playing materials, and other essentials.',
    color: 'from-emerald-500 to-teal-600',
    light: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    tag: 'In-Kind',
    subject: 'general',
    message: 'Hello, I would like to donate materials (clothing, books, supplies, or essentials). Kindly share drop-off details and priority needs.',
    ctaLabel: 'Send Message',
    actions: ['Clothing & shoes', 'School supplies', 'Books & toys', 'Bedding & furniture'],
  },
  {
    Icon: UserPlus,
    title: 'Volunteer',
    description: 'Share your time, skills, and talents with our children. Volunteer visits are highly appreciated and create lasting impact.',
    color: 'from-purple-500 to-pink-600',
    light: 'bg-purple-50',
    iconColor: 'text-purple-600',
    border: 'border-purple-100',
    tag: 'Volunteer',
    subject: 'volunteer',
    message: 'Hello, I am interested in volunteering with Jambo Rafiki. Please share the next steps and requirements.',
    ctaLabel: 'Send Message',
    actions: ['Teaching & tutoring', 'Skills training', 'Healthcare support', 'Administrative help'],
  },
  {
    Icon: Heart,
    title: 'Prayer Support',
    description: 'Join us in prayer for our children, staff, and the sustainability of our programs. Spiritual support is invaluable.',
    color: 'from-rose-500 to-pink-500',
    light: 'bg-rose-50',
    iconColor: 'text-rose-600',
    border: 'border-rose-100',
    tag: 'Prayer',
    subject: 'general',
    message: 'Hello, I would like to support Jambo Rafiki through prayer and church collaboration. Please let me know how to join.',
    ctaLabel: 'Send Message',
    actions: ['Prayer partnership', 'Church collaboration', 'Prayer events', 'Spiritual guidance'],
  },
];

function buildContactLink(subject: string, message: string) {
  const params = new URLSearchParams({ subject, message });
  return `/contact?${params.toString()}#contact-form`;
}

export default function WaysToHelpSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-orange-50 to-pink-50 rounded-full opacity-60 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            Get Involved
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ways to Make a Difference
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Every contribution, big or small, transforms lives. Choose how you'd like to support our mission.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Featured card — Financial Donations */}
        <div className="mb-6">
          {(() => {
            const { Icon, title, description, color, actions, tag, ctaLabel } = ways[0];
            const to = ways[0].to ?? '/donations#donation-form';
            return (
              <Link to={to} className={`group relative block bg-gradient-to-br ${color} rounded-3xl p-10 overflow-hidden`}>
                <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 right-40 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-start gap-8">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-white/80 leading-relaxed mb-6">{description}</p>
                    <span className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold text-sm px-6 py-3 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                      {ctaLabel} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Right — actions */}
                  <div className="lg:w-64 flex-shrink-0">
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">
                      How You Can Help
                    </p>
                    <ul className="space-y-2">
                      {actions.map((a) => (
                        <li key={a} className="flex items-center gap-2 text-white/90 text-sm">
                          <CheckCircle className="h-4 w-4 text-white/60 flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            );
          })()}
        </div>

        {/* Remaining 3 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {ways.slice(1).map(({ Icon, title, description, color, light, iconColor, border, tag, actions, subject, message, ctaLabel }) => (
            <Link
              key={title}
              to={buildContactLink(subject ?? 'general', message ?? '')}
              className={`group relative bg-white border-2 ${border} rounded-2xl p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col`}
            >
              {/* Hover wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Left hover accent */}
              <div className={`absolute left-0 top-5 bottom-5 w-1 bg-gradient-to-b ${color} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-full`} />

              <div className="relative flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 ${light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <span className={`text-[11px] font-semibold ${iconColor} ${light} px-2 py-0.5 rounded-full`}>
                      {tag}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>

                {/* Actions */}
                <div className="border-t border-gray-100 pt-5 mb-6 flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-semibold">
                    How You Can Help
                  </p>
                  <ul className="space-y-2">
                    {actions.map((action) => (
                      <li key={action} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <span className={`inline-flex items-center gap-2 text-sm font-semibold ${iconColor} hover:gap-3 transition-all duration-200 mt-auto`}>
                  {ctaLabel} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}