// ProgramsSection.tsx
// Three flagship programmes; the full list lives on /programs (pages/Programs/ProgramsGrid.tsx).
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Heart, Sprout } from 'lucide-react';

const FEATURED_PROGRAMS = [
  {
    title: 'Children Ministries',
    description: 'Psychosocial support, guidance and counselling for the holistic wellbeing of every child.',
    image: '/images/happy.webp',
    icon: Heart,
  },
  {
    title: 'Education',
    description: 'School fees, uniforms, books and academic support so every child can thrive in class.',
    image: '/images/students.webp',
    icon: GraduationCap,
  },
  {
    title: 'Food Security',
    description: 'Daily nutritious meals and a shamba where the children learn to grow their own food.',
    image: '/images/IMG_0473.webp',
    icon: Sprout,
  },
];

export default function ProgramsSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">What we do</p>
            <h2 className="text-3xl sm:text-4xl">Care that reaches the whole child</h2>
            <p className="mt-4 text-lg text-gray-600">
              Through our church and children&rsquo;s centre we meet everyday needs and invest in each child&rsquo;s future.
            </p>
          </div>
          <Link
            to="/programs"
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-orange-700 transition-colors hover:text-orange-800"
          >
            All programmes <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {FEATURED_PROGRAMS.map(({ title, description, image, icon: Icon }) => (
            <Link
              key={title}
              to="/programs"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
