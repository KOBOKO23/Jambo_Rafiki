import { Target, Compass, Award } from "lucide-react";

export default function VisionMissionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To see an empowered and healthy community, living in a secured livelihood.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Compass className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To improve the quality of life of orphans and vulnerable children through sustainable development.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">Objective</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide basic needs and build resilience in orphans and vulnerable children.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
