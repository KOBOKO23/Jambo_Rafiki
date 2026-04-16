import { useState } from "react";
import { Send, CheckCircle, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { api } from '@/services/api';
import { useSearchParams } from 'react-router-dom';

type Status = "idle" | "submitting" | "success" | "error";

const SUBJECTS = [
  { value: "donation",    label: "Make a Donation" },
  { value: "volunteer",  label: "Volunteer Opportunity" },
  { value: "visit",      label: "Schedule a Visit" },
  { value: "partnership",label: "Partnership Inquiry" },
  { value: "general",    label: "General Inquiry" },
  { value: "other",      label: "Other" },
];

export default function ContactForm() {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') ?? '';
  const initialMessage = searchParams.get('message') ?? '';

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    name: "", email: "", subject: initialSubject, message: initialMessage,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage('');

    try {
      await api.contacts.submit(form);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send your message. Please try again.');
      setStatus('error');
    }
  };

  if (status === "success") {
    return (
      <div id="contact-form" className="bg-white border-2 border-gray-100 rounded-3xl p-10 shadow-lg flex flex-col items-center text-center gap-4 min-h-[420px] justify-center scroll-mt-28">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          Thank you for reaching out. We'll get back to you as soon as possible — usually within 24 hours.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
          className="mt-2 text-sm text-orange-500 font-medium hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div id="contact-form" className="bg-white border-2 border-gray-100 rounded-3xl p-10 shadow-lg flex flex-col items-center text-center gap-4 min-h-[420px] justify-center scroll-mt-28">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Message Not Sent</h3>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          {errorMessage}
        </p>
        <button
          onClick={() => { setStatus("idle"); setErrorMessage(''); }}
          className="mt-2 text-sm text-orange-500 font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div id="contact-form" className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg scroll-mt-28">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
          <p className="text-xs text-gray-400">We usually reply within 24 hours</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              Your Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Subject *
          </label>
          <select
            id="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-gray-900 text-sm"
          >
            <option value="">Select a subject…</option>
            {SUBJECTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Your Message *
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us how you'd like to help or what you'd like to know…"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder-gray-400 text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
          ) : (
            <>Send Message <Send className="h-4 w-4" /></>
          )}
        </button>
      </form>
    </div>
  );
}