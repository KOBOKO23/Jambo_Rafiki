// pages/Gallery/CTASection.tsx
import { Camera, Heart, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative bg-gray-950 overflow-hidden py-24">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

      {/* Background glow blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-xl shadow-orange-900/40">
          <Camera className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-4xl font-bold text-white mb-5">
          Want to Visit and{" "}
          <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Take Photos?
          </span>
        </h2>

        <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          We welcome visitors who want to capture and share the joy at Jambo Rafiki.
          Contact us to schedule a visit.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-orange-900/40 hover:shadow-xl hover:shadow-orange-900/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            Schedule a Visit <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="/get-involved"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            <Heart className="h-5 w-5 text-pink-400" fill="currentColor" />
            Support Our Children
          </a>
        </div>
      </div>
    </section>
  );
}