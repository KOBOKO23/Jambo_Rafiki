
export default function StorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE — TEXT */}
          <div>
            <h2 className="text-4xl text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Jambo Rafiki is a Christian community-based organization that began as a holiday club
                for orphans and vulnerable children and transformed into a full children orphanage
                and church centre.
              </p>
              <p>
                We are legally registered with the Government of Kenya under the Department of Social
                Services, Culture and Sports to provide social protection to orphaned and vulnerable
                children, the neglected, marginalized, and abused.
              </p>
              <p>
                Our mission is clear: to restore dignity and hope for the future to every child who
                walks through our doors.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl shadow-xl overflow-hidden">
              <img
                src="/images/IMG_0460.webp"
                alt="Jambo Rafiki history"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative blurred circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-300 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
