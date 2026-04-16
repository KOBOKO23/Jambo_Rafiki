export default function StatusPlansSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
            <h2 className="text-3xl text-gray-900 mb-6">Current Target</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Jambo Rafiki currently has
                <span className="text-orange-600"> 30 children </span>
                residing in the orphanage.
              </p>
              <p>
                We prioritize orphans and widows, providing them a safe environment.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-2xl">
            <h2 className="text-3xl text-gray-900 mb-6">Future Plans</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                Establish a well-equipped orphanage home for 100 children
              </li>

              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                Initiate sustainable income-generating activities
              </li>

              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                Procure an orphanage van for transportation
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
