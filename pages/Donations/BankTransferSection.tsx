import { useState } from 'react';
import { Landmark, Send, Loader2, CheckCircle } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const PURPOSES = [
  { value: 'General Support',  label: 'General Support' },
  { value: 'Education',        label: 'Education' },
  { value: 'Healthcare',       label: 'Healthcare' },
  { value: 'Food & Nutrition', label: 'Food & Nutrition' },
  { value: 'Shelter',          label: 'Shelter' },
];

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-orange-400 ' +
  'focus:ring-2 focus:ring-orange-100 outline-none text-slate-900 placeholder-slate-300 text-sm transition-all';

export function BankTransferSection() {
  const [form, setForm] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    purpose: 'General Support',
  });
  const [status, setStatus]   = useState<Status>('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [reference, setReference] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
      const res = await fetch(`${baseUrl}/api/v1/donations/bank-transfer-request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setReference(data.reference);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setForm({ donor_name: '', donor_email: '', amount: '', purpose: 'General Support' });
    setStatus('idle');
    setErrorMsg('');
    setReference('');
  };

  return (
    <section className="border-y border-slate-100 bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="flex items-start gap-5 border-b border-slate-100 px-8 py-7">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 ring-1 ring-orange-100">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">
                Wire Transfer
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Donate by Bank Transfer</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                Enter your details below and we'll email you our bank account information privately,
                along with a unique reference number to track your donation.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 ring-1 ring-green-100">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Details sent to your email!</p>
                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    Check your inbox for our bank account details. Please use reference{' '}
                    <span className="font-mono font-bold text-orange-500">{reference}</span>{' '}
                    when making the transfer so we can match it to your donation.
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="mt-2 text-sm font-semibold text-orange-500 underline underline-offset-4 hover:text-orange-600 transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="donor_name"
                    value={form.donor_name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                    className={inputCls}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="donor_email"
                    value={form.donor_email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className={inputCls}
                  />
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    className={inputCls}
                  />
                </div>

                {/* Purpose */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Purpose
                  </label>
                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    {PURPOSES.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                    {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Me the Bank Details</>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}