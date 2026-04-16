import { useState } from 'react';
import { UserPlus, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { api } from '@/services/api';

export function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    availability: '',
    duration: '',
    motivation: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await api.volunteers.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        skills: formData.skills,
        availability: formData.availability,
        duration: formData.duration,
        motivation: formData.motivation,
      });
      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        skills: '',
        availability: '',
        duration: '',
        motivation: ''
      });
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
      // Reset error message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl text-gray-900">Volunteer Application</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Join our team and make a lasting impact in the lives of children. Fill out the form below and we'll get in touch with you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="e.g., Nairobi, Kenya"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="+254 XXX XXX XXX"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-gray-700 mb-2">
            Skills & Expertise *
          </label>
          <input
            type="text"
            id="skills"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="e.g., Teaching, Healthcare, Administration"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-gray-700 mb-2">
            Availability *
          </label>
          <select
            id="availability"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            value={formData.availability}
            onChange={handleChange}
          >
            <option value="">Select your availability</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="flexible">Flexible</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="block text-gray-700 mb-2">
            Preferred Commitment Duration *
          </label>
          <select
            id="duration"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            value={formData.duration}
            onChange={handleChange}
          >
            <option value="">Select duration</option>
            <option value="1 month">1 month</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700 mb-2">
            Why do you want to volunteer? *
          </label>
          <textarea
            id="motivation"
            required
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
            placeholder="Tell us about your motivation and how you'd like to contribute..."
            value={formData.motivation}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <Send className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>Thank you for your interest! We'll review your application and get back to you soon.</span>
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}