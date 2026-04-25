// HeroSection.tsx
import { Heart, ArrowRight, ShieldCheck, Users } from 'lucide-react';

const stats = [
  { value: '30+', label: 'Children supported' },
  { value: '100%', label: 'Funds accountability' },
  { value: '5+', label: 'Years of impact' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50/40 to-white" />

      {/* Decorative circle blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-gradient-to-tr from-purple-200 to-pink-100 opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">

          {/* ── Left: copy ── */}
          <div className="flex flex-col">
            {/* Pill badge */}
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-1.5 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">
                Transform Lives Today
              </span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-6xl">
              Give a Child{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  a Future
                </span>
                {/* underline squiggle */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 12"
                  className="absolute -bottom-2 left-0 w-full fill-orange-200"
                >
                  <path d="M2 10 C 40 2, 80 14, 120 6 C 160 -2, 200 10, 218 6" strokeWidth="4" stroke="currentColor" fill="none" strokeLinecap="round" className="stroke-orange-300" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-500 max-w-lg">
              Your donation provides food, education, healthcare, and unwavering love to 30 orphaned
              children at Jambo Rafiki. Every shilling counts — and every donor is remembered.
            </p>

            {/* Quick stats row */}
            <div className="mt-8 flex flex-wrap gap-6">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#donation-form"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-300"
              >
                <Heart className="h-4 w-4" fill="white" />
                Donate Now
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#sponsor-child"
                className="inline-flex items-center gap-2 rounded-full border-2 border-orange-200 bg-white px-7 py-3.5 text-sm font-bold text-orange-600 transition-all duration-200 hover:border-orange-400 hover:bg-orange-50"
              >
                <Users className="h-4 w-4" />
                Sponsor a Child
              </a>
            </div>

            {/* Trust micro-note */}
            <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
              Registered — Dept. of Social Services, Culture & Sports, Government of Kenya
            </p>
          </div>

          {/* ── Right: image ── */}
          <div className="relative">
            {/* Shadow blob */}
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-orange-200 to-pink-200 opacity-30 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-orange-100">
              <img
                src="/images/IMG_0461.webp"
                alt="Children at Jambo Rafiki"
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
              />
              {/* Overlay gradient bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-md">
                  <Heart className="h-5 w-5 text-white" fill="white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Your donation goes directly to</p>
                  <p className="text-xs text-gray-500">Food · Education · Healthcare · Shelter</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}