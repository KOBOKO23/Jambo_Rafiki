// RecentActivitiesSection.tsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const recentActivities = [
  { 
    title: 'Sunday Worship Service', 
    date: 'Dec 1, 2024', 
    img: 'images/IMG_0347.webp'
  },
  { 
    title: 'School Term Begins', 
    date: 'Nov 28, 2024', 
    img: 'images/IMG_0456.webp'
  },
  { 
    title: 'Sharing a Meal', 
    date: 'Nov 25, 2024', 
    img: 'images/IMG_0468.webp'
  },
  { 
    title: 'Time to Learn Farming', 
    date: 'Nov 22, 2024', 
    img: 'images/IMG_0473.webp'
  },
];

export default function RecentActivitiesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Recent Activities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with what's happening at Jambo Rafiki
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-4"></div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentActivities.map((activity, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-orange-200 hover:shadow-xl transition-all">
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={activity.img} 
                    alt={activity.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Activity Content */}
                <div className="p-4">
                  <h4 className="text-gray-900 mb-2">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {activity.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Gallery Link */}
        <div className="text-center mt-8">
          <Link
            to="/gallery"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            View Full Gallery
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}