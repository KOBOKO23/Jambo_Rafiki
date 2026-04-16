import { MessageSquare, Mail, ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_INFO } from '@/config/contact';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

export default function CallToAction() {
  const { organization } = useOrganizationConfig();
  const email = organization.contact.email || CONTACT_INFO.email;
  const callHref = organization.contact.call_redirect_url || (organization.contact.call_redirect_number ? `tel:${organization.contact.call_redirect_number}` : '');

  return (
    <section className="relative bg-gray-950 overflow-hidden py-24">

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

      {/* Background glow blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-xl shadow-orange-900/40">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-white mb-5">
          We're Here to{" "}
          <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Answer Your Questions
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
          Whether you're interested in supporting our cause, visiting the
          orphanage, or learning more about our programs, we'd love to connect.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-orange-900/40 hover:shadow-xl hover:shadow-orange-900/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Mail className="h-5 w-5" />
            Email Us Now
            <ArrowRight className="h-4 w-4" />
          </a>
          {callHref ? (
            <a
              href={callHref}
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-200"
            >
              <Phone className="h-5 w-5 text-pink-400" />
              Call Us
            </a>
          ) : null}
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            <Phone className="h-5 w-5 text-pink-400" />
            Visit Contact Page
          </Link>
        </div>

        {/* Email address displayed */}
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-700" />
          <a
            href={`mailto:${email}`}
            className="hover:text-orange-400 transition-colors"
          >
           {email}
          </a>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-700" />
        </div>
      </div>
    </section>
  );
}