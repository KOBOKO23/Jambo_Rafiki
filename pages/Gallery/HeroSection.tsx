// pages/Gallery/HeroSection.tsx
import { Camera, Images } from "lucide-react";
type HeroSectionProps = {
  previewUrls: string[];
  photoCount: number;
  loading?: boolean;
};

export default function HeroSection({ previewUrls, photoCount, loading = false }: HeroSectionProps) {

  return (
    <section className="relative bg-gray-950 overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 z-10" />

      {/* Blurred preview images as background decoration */}
      <div className="absolute inset-0 flex">
        {previewUrls.map((url, i) => (
          <div key={i} className="flex-1 overflow-hidden opacity-20">
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover scale-110"
              style={{ filter: "blur(8px)" }}
            />
          </div>
        ))}
        {previewUrls.length === 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-pink-900/20 to-gray-900/20" />
        )}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/70 to-gray-950/90" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-xl shadow-orange-900/40 p-4">
            <Camera className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Photo{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Capturing moments of hope, joy, and transformation at Jambo Rafiki Children Orphanage
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500" />
            <div className="flex items-center gap-1.5 text-orange-400 text-sm font-medium">
              <Images className="h-4 w-4" />
              {loading ? 'Loading photos...' : `${photoCount} photos from our live gallery`}
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-pink-500" />
          </div>
        </div>
      </div>
    </section>
  );
}