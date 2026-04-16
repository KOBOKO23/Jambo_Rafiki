import { useState } from 'react';
import { Gift, HandHeart, Heart, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

// ─── ImpactStats ─────────────────────────────────────────────────────────────

const impactStories = [
  {
    Icon: Heart,
    title: 'Education Transforms',
    amount: 1000,
    impact: 'Feeds one child for a week',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    Icon: Gift,
    title: 'Learning Empowers',
    amount: 5000,
    impact: 'School supplies for one term',
    color: 'from-orange-500 to-pink-600',
  },
  {
    Icon: HandHeart,
    title: 'Health Matters',
    amount: 10000,
    impact: 'Medical care for one child',
    color: 'from-purple-500 to-pink-600',
  },
];

export function ImpactStats({ onSelectAmount }: { onSelectAmount?: (amount: number) => void }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            Real Impact
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Your Donation at Work</h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            See how your donation directly transforms lives
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impactStories.map(({ Icon, title, amount, impact, color }) => (
            <button
              key={title}
              onClick={() => onSelectAmount?.(amount)}
              className="group text-left bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-transparent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="relative space-y-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  KES {amount.toLocaleString()}
                </div>
                <p className="text-gray-500 text-sm">{impact}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Donate this amount <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SponsorshipSection ───────────────────────────────────────────────────────

type SponsorStatus = 'idle' | 'submitting' | 'success' | 'error';

const SPONSORSHIP_LEVELS = [
  { value: 'Basic', label: 'Basic', description: 'Essential support' },
  { value: 'Premium', label: 'Premium', description: 'Education & healthcare' },
  { value: 'Full', label: 'Full', description: 'All-round care' },
];

export function SponsorshipSection() {
  const [status, setStatus] = useState<SponsorStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await api.sponsorships.submitInterest({
        ...form,
        preferred_level: selectedLevel || null,
      });
      setStatus('success');
      setForm({ name: '', email: '', phone: '' });
      setSelectedLevel('');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-5 shadow-lg shadow-pink-200">
            <Heart className="h-7 w-7 text-white" fill="white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Sponsor a Child</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Start a meaningful journey — support a child monthly and watch them flourish.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8">
          {status === 'success' ? (
            <div className="py-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">We'll be in touch!</h3>
              <p className="text-gray-500 max-w-sm text-sm">
                Thank you for expressing interest. Our team will contact you shortly to guide
                you through the sponsorship journey.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-sm text-orange-500 font-medium hover:underline"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Sponsorship Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {SPONSORSHIP_LEVELS.map(({ value, label, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedLevel(value)}
                      className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-sm transition-all duration-200 ${
                        selectedLevel === value
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 text-gray-600 hover:border-pink-300'
                      }`}
                    >
                      <span className="font-semibold">{label}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none text-gray-900 placeholder-gray-400 transition-colors"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none text-gray-900 placeholder-gray-400 transition-colors"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Phone (+254…)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none text-gray-900 placeholder-gray-400 transition-colors"
              />

              {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-full font-semibold shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
                ) : (
                  <><Heart className="h-5 w-5" fill="white" /> Express Interest</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Backwards-compat alias — any file importing SponsorshipSectionImproved still works
export { SponsorshipSection as SponsorshipSectionImproved };