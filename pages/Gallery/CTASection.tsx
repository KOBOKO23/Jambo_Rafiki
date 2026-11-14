// pages/Gallery/CTASection.tsx
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-leaf-900 px-6 py-14 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-leaf-500/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl text-white sm:text-4xl">Come and see it for yourself</h2>
          <p className="mt-4 text-lg leading-relaxed text-leaf-100/90">
            Visitors are always welcome at Jambo Rafiki. Spend a day with the children, join a Sunday service, or help
            us capture the next chapter of their story.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-orange-400"
            >
              Plan a visit <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/donations"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
            >
              <Heart className="h-5 w-5 text-orange-300" fill="currentColor" aria-hidden="true" />
              Support the children
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
