import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Every child deserves love, care, and hope for the future. Your support can transform lives today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
              <a
                href="/donations"
                className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all"
              >
                Make a Donation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-orange-600 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl text-white mb-2">30+</div>
                <div className="text-sm text-white/90">Lives Changed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl text-white mb-2">100%</div>
                <div className="text-sm text-white/90">Transparency</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl text-white mb-2">24/7</div>
                <div className="text-sm text-white/90">Care Provided</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl text-white mb-2">∞</div>
                <div className="text-sm text-white/90">Love Given</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
