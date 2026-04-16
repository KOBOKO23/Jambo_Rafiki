import ContactInfoSection from "./ContactInfoSection";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactInfoSection />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
