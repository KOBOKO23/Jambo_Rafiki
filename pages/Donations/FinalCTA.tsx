// FinalCTA.tsx
import { ArrowRight, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gray-950 py-24">

      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

      {/* Background glow blobs */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />

      {/* Decorative dots grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">

        {/* Icon badge */}
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-xl shadow-orange-900/40">
          <Heart className="h-8 w-8 text-white" fill="white" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
          Every Donation{' '}
          <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Changes a Life
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
          Your support provides food, education, healthcare, and hope to children who need it most.
          No contribution is too small.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#donation-form"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-900/60"
          >
            <Heart className="h-4 w-4" fill="white" />
            Make a Donation
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10"
          >
            <Mail className="h-4 w-4 text-pink-400" />
            Contact Us
          </Link>
        </div>

        {/* Bottom trust note */}
        <p className="mt-10 text-[10px] uppercase tracking-[0.25em] text-gray-600">
          Registered · Government of Kenya — Dept. of Social Services, Culture &amp; Sports
        </p>
      </div>

    </section>
  );
}