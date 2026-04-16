// ImpactStoriesSection.jsx

const ImpactStoriesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Empowering Youth Through Education</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Meet John, a recipient of our scholarship program. His journey from a small village to a university student has inspired many young people in his community. Through our support, he is now pursuing a degree in engineering and aims to give back by mentoring high-school students.
            </p>
          </div>
          <div className="h-80 bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500">Impact Story Image</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStoriesSection;
