const items = [
  {
    image: '/images/IMG_0456.webp',
  },
  {
    image: '/images/IMG_0468.webp',
  },
  {
    image: '/images/IMG_0498.webp',
  },
];

export default function ProgramsInAction() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Programs in Action
          </h2>
          <p className="text-xl text-gray-600">
            Visual stories from our programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="group">
              <div className="relative aspect-[4/3] rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow">
                
                <img
                  src={item.image}
                  alt="Program"
                  className="w-full h-full object-cover"
                />

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}