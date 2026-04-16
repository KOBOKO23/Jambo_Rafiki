export function TrustIndicators() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl text-blue-600 mb-3">100%</div>
            <h3 className="text-xl text-gray-900 mb-2">Transparency</h3>
            <p className="text-gray-600">Full accountability on how funds are used</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl text-orange-600 mb-3">30+</div>
            <h3 className="text-xl text-gray-900 mb-2">Children Supported</h3>
            <p className="text-gray-600">Direct impact on orphaned children's lives</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl text-purple-600 mb-3">24/7</div>
            <h3 className="text-xl text-gray-900 mb-2">Care Provided</h3>
            <p className="text-gray-600">Round-the-clock support and protection</p>
          </div>
        </div>
      </div>
    </section>
  );
}
