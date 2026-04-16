export default function DirectorSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== LOCAL DIRECTOR ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">

          {/* IMAGE */}
          <div className="flex justify-center lg:justify-start relative img-fade-in">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-3xl opacity-25"></div>

              <img
                src="/images/IMG_1537.webp"
                alt="Mr. Benjamin Oyoo Ondoro - Executive Director & Founder"
                className="relative w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-2xl border-4 border-white shadow-2xl"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="img-fade-in img-delay-2">
            <h2 className="text-4xl text-gray-900 mb-4">Leadership</h2>
            <h3 className="text-2xl text-orange-600 mb-2">
              Mr. Benjamin Oyoo Ondoro
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Executive Director & Founder
            </p>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Mr. Benjamin Oyoo Ondoro founded Jambo Rafiki with a vision to restore hope and dignity
                to orphaned and vulnerable children in Oyugis, Kenya.
              </p>
              <p>
                With unwavering dedication, Mr. Ondoro has transformed what began as a small holiday club
                into a thriving orphanage and church center providing comprehensive care for 30 children.
              </p>
              <p>
                Under his leadership, Jambo Rafiki has become a beacon of hope—offering shelter, food,
                education, healthcare, spiritual guidance, and love to children who need it most.
              </p>
              <p className="mt-4 text-gray-500 text-sm italic">
                Email:{' '}
                <a
                  href="mailto:infodirector@jamborafiki.org"
                  className="underline hover:text-orange-600"
                >
                  infodirector@jamborafiki.org
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* ===== INTERNATIONAL DIRECTOR ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <div className="flex justify-center lg:justify-start relative img-fade-in">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-3xl opacity-25"></div>

              <img
                src="/images/international.jpeg" 
                alt="JM - International Director"
                className="relative w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-2xl border-4 border-white shadow-2xl"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="img-fade-in img-delay-2">
            <h2 className="text-4xl text-gray-900 mb-4">Leadership</h2>
            <h3 className="text-2xl text-orange-600 mb-2">
              JM
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              International Director
            </p>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                JM supports the global mission of Jambo Rafiki by connecting the organization
                with partners and supporters across the world.
              </p>
              <p>
                Through international collaboration and outreach, JM helps expand opportunities
                for children and strengthens the impact of the ministry.
              </p>
              <p>
                His role ensures that the vision of hope, care, and transformation continues
                to grow beyond borders.
              </p>

              <p className="mt-4 text-gray-500 text-sm italic">
                Email:{' '}
                <a
                  href="mailto:infointernationaldirector@jamborafiki.org"
                  className="underline hover:text-orange-600"
                >
                  infointernationaldirector@jamborafiki.org
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}