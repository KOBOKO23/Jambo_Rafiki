// pages/Gallery/StatsSection.tsx
import { Users, Heart, Calendar, Camera } from "lucide-react";

const stats = [
  {
    Icon: Camera,
    value: "500+",
    label: "Total Photos",
    accent: "from-orange-500 to-pink-500",
    light: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    Icon: Heart,
    value: "30",
    label: "Children",
    accent: "from-rose-500 to-pink-600",
    light: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    Icon: Calendar,
    value: "50+",
    label: "Events Captured",
    accent: "from-sky-500 to-blue-600",
    light: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    Icon: Users,
    value: "Weekly",
    label: "New Updates",
    accent: "from-violet-500 to-purple-600",
    light: "bg-violet-50",
    iconColor: "text-violet-500",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ Icon, value, label, light, iconColor, accent }) => (
            <div
              key={label}
              className="group relative text-center bg-white border-2 border-gray-100 rounded-2xl py-8 px-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Hover wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className={`relative w-14 h-14 ${light} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-7 w-7 ${iconColor}`} />
              </div>

              <div className="relative text-3xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="relative text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}