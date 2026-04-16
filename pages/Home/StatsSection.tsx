// StatsSection.jsx
import { useEffect, useState } from 'react';
import { Heart, Users, Church, Target } from 'lucide-react';
import { api } from '@/services/api';

type StatItem = {
  number: string;
  label: string;
  icon: typeof Heart;
};

export default function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([
    { number: '—', label: 'Children Profiles', icon: Heart },
    { number: '—', label: 'Gallery Photos', icon: Target },
    { number: '—', label: 'Community Voices', icon: Users },
    { number: '—', label: 'Gallery Categories', icon: Church },
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const [children, photos, testimonials, categories] = await Promise.all([
          api.sponsorships.getChildren(),
          api.gallery.listPhotos('page=1&page_size=1'),
          api.testimonials.listApproved(),
          api.gallery.listCategories(),
        ]);

        if (!mounted) return;

        const childrenCount = Array.isArray(children) ? children.length : 0;
        setStats([
          { number: String(childrenCount), label: 'Children Profiles', icon: Heart },
          { number: String(photos.count), label: 'Gallery Photos', icon: Target },
          { number: String(testimonials.count), label: 'Community Voices', icon: Users },
          { number: String(categories.length), label: 'Gallery Categories', icon: Church },
        ]);
      } catch {
        // Keep placeholders if public stats endpoints are temporarily unavailable.
      }
    }

    void loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl text-gray-900 font-bold mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
