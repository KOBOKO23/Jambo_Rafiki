import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await api.newsletter.subscribe({ email, name });
      setStatus('success');
      // Reset form
      setEmail('');
      setName('');
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
      // Reset error message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-8 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl">Stay Updated</h3>
      </div>

      <p className="text-white/90 mb-6">
        Subscribe to our newsletter to receive updates about our children, programs, and how you can help make a difference.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsletter-name" className="block text-white/90 mb-2">
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="newsletter-name"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-white focus:outline-none transition-colors"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="newsletter-email" className="block text-white/90 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="newsletter-email"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-white focus:outline-none transition-colors"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-white text-orange-600 px-8 py-4 rounded-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              <span>Subscribe to Newsletter</span>
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>Thank you for subscribing! Check your email for confirmation.</span>
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}