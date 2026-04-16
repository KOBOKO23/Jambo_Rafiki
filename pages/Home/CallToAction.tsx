// CallToAction.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Every Child Deserves a Chance
        </h2>
        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Your support can transform lives. Whether through donations, volunteering, or prayers, you can make a lasting impact on these precious children.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/get-involved"
            className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all"
          >
            Get Involved Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-orange-600 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
