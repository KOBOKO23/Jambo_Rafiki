import { ArrowRight, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="relative bg-gray-950 overflow-hidden py-24">

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

      {/* Glow blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-xl shadow-orange-900/40">
          <Heart className="h-8 w-8 text-white" fill="white" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
          Every Donation{' '}
          <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Changes Lives
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
          Your support provides food, education, healthcare, and hope to children who need it most.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#donation-form"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-orange-900/40 hover:shadow-xl hover:shadow-orange-900/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Heart className="h-5 w-5" fill="white" />
            Make a Donation
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            <Mail className="h-5 w-5 text-pink-400" />
            Contact Us
          </Link>
        </div>

        {/* Small trust note */}
        <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
          Registered · Government of Kenya — Dept of Social Services, Culture & Sports
        </p>
      </div>
    </section>
  );
}