import { useEffect, useState } from 'react';
import { Smile, Quote, MessageSquarePlus, X, CheckCircle, Loader2, Star } from 'lucide-react';
import { api } from '@/services/api';
import type { TestimonialRole } from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

const ROLE_OPTIONS = [
  { value: 'community_member', label: 'Community member' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'donor', label: 'Donor' },
  { value: 'sponsor', label: 'Sponsor' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
] as const;

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hovered || value)
                ? 'text-orange-400 fill-orange-400'
                : 'text-gray-200 fill-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-300 to-pink-400 rounded-full flex items-center justify-center shadow-md">
            <Smile className="h-7 w-7 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-400">{testimonial.role}</p>
            <StarRating value={testimonial.rating} />
          </div>
        </div>
        <Quote className="h-7 w-7 text-orange-200 flex-shrink-0 mt-1" />
      </div>
      <p className="text-gray-600 leading-relaxed italic text-sm">
        "{testimonial.text}"
      </p>
    </div>
  );
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────

type ModalStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SubmitModalProps {
  onClose: () => void;
}

function SubmitModal({ onClose }: SubmitModalProps) {
  const [status, setStatus] = useState<ModalStatus>('idle');
  const [form, setForm] = useState({ name: '', email: '', role: 'community_member' as TestimonialRole, roleCustom: '', text: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await api.testimonials.submit({
        name: form.name,
        email: form.email,
        role: form.role,
        role_custom: form.role === 'other' ? form.roleCustom : undefined,
        text: form.text,
      });
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit your testimonial.');
      setStatus('error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-24 right-6 z-50 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">Share Your Experience</h3>
              <p className="text-white/70 text-sm">Your story inspires others to give</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {status === 'success' ? (
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Thank you!</h4>
                <p className="text-sm text-gray-500">Your testimonial has been submitted for review.</p>
                <button
                  onClick={onClose}
                  className="mt-2 text-sm text-orange-500 font-medium hover:underline"
                >
                  Close
                </button>
              </div>
            ) : status === 'error' ? (
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                  <X className="h-7 w-7 text-red-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Submission failed</h4>
                <p className="text-sm text-gray-500">{errorMessage}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 text-sm text-orange-500 font-medium hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none text-sm text-gray-900 placeholder-gray-400 transition-colors"
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none text-sm text-gray-900 placeholder-gray-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none text-sm text-gray-900 transition-colors bg-white"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {form.role === 'other' && (
                  <input
                    name="roleCustom"
                    value={form.roleCustom}
                    onChange={handleChange}
                    required
                    placeholder="Specify your role"
                    className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none text-sm text-gray-900 placeholder-gray-400 transition-colors"
                  />
                )}

                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  required
                  minLength={20}
                  rows={4}
                  placeholder="Share your experience with Jambo Rafiki…"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none text-sm text-gray-900 placeholder-gray-400 resize-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold text-sm shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                  ) : (
                    'Submit Testimonial'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadApprovedTestimonials() {
      setIsLoadingTestimonials(true);
      setLoadError('');
      try {
        const response = await api.testimonials.listApproved();
        if (!mounted) return;

        const mapped: Testimonial[] = response.results.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.display_role || 'Community Member',
          text: item.text,
          rating: 5,
        }));

        setTestimonials(mapped);
      } catch (error) {
        if (mounted) {
          setTestimonials([]);
          setLoadError(error instanceof Error ? error.message : 'Unable to load testimonials right now.');
        }
      } finally {
        if (mounted) {
          setIsLoadingTestimonials(false);
        }
      }
    }

    void loadApprovedTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-orange-50 to-pink-50 py-20 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            Community Voices
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Voices from our community and supporters
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* Grid */}
        {isLoadingTestimonials ? (
          <div className="rounded-2xl border border-orange-100 bg-white/70 px-6 py-10 text-center text-sm text-gray-500">
            Loading community testimonials...
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-orange-100 bg-white/70 px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">No approved testimonials yet.</p>
            <p className="mt-2 text-sm text-gray-500">
              {loadError || 'Be the first to share your story using the button below.'}
            </p>
          </div>
        )}
      </div>

      {/* Corner FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-3.5 rounded-full shadow-xl shadow-orange-300 hover:shadow-2xl hover:shadow-orange-400 hover:-translate-y-1 transition-all duration-200 font-semibold text-sm"
      >
        <MessageSquarePlus className="h-5 w-5" />
        Share Your Story
      </button>

      {/* Modal */}
      {modalOpen && (
        <SubmitModal
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}