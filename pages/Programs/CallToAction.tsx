export default function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl text-white mb-4">
          Support Our Programs
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Your contribution helps us continue these vital programs for children in need
        </p>
        <a
          href="/get-involved"
          className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all"
        >
          Make a Difference Today
        </a>
      </div>
    </section>
  );
}
