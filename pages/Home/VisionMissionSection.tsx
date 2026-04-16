// VisionMissionSection.jsx
import { Heart, Target } from 'lucide-react';

export default function VisionMissionSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">Our Purpose</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto"></div>
        </div>

        {/* Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To see an empowered and healthy community, living in a secured livelihood, health prosperous with dignity and hope for the future.
            </p>
          </div>

          {/* Vision Image (updated) */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden group">
            <img
              src="images/director_students.jpg"
              alt="Vision placeholder"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4">
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Mission Image (updated) */}
          <div className="relative aspect-video bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden group order-last lg:order-first">
            <img
              src="images/happy.jpg"
              alt="Mission placeholder"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4">
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center mb-6">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To improve the quality of life of orphans and vulnerable children through sustainable local development in the orphanage as well as quality education.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
