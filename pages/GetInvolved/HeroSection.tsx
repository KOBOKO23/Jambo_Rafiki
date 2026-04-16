import { Globe, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 opacity-60"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* TEXT SECTION */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Globe className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">Global Community Support</span>
            </div>

            <h1 className="text-5xl lg:text-6xl text-gray-900 mb-6">Get Involved</h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              This is a call and appeal to support orphaned and vulnerable children. 
              Your prayers, donations, volunteer visits, and gifts will be highly appreciated.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/donations"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all"
              >
                Donate Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full hover:bg-orange-50 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl shadow-2xl overflow-hidden bg-gray-100">
              <img
                src="/images/IMG_0455.webp"  
                /* replace with any placeholder image */
                alt="Support Impact"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
