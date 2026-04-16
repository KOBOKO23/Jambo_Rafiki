export default function StoriesOfHopeSection() {
  const impactStories = [
    {
      name: 'Women Ministry Group',
      story: 'Helping Women with Provisions',
      image: 'images/IMG_0458.webp',
    },
    {
      name: 'David',
      age: 10,
      story: 'Clothed and Supported for School',
      image: 'images/davie2.jpg',
    },
    {
      name: 'Grace',
      age: 14,
      story:
        'Educating young girls and empowering them to break the cycle of poverty',
      image: 'images/grace.jpg',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Stories of Hope
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real children, real transformations, real impact
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-4"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impactStories.map((story, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all hover:-translate-y-2">

                {/* Bigger Image */}
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={story.image}
                    alt={`${story.name}'s story`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* subtle overlay only (no text inside) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-1">
                    {story.name}
                  </h3>

                  {story.age && (
                    <p className="text-sm text-gray-500 mb-3">
                      Age {story.age}
                    </p>
                  )}

                  <p className="text-gray-600 leading-relaxed">
                    {story.story}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}