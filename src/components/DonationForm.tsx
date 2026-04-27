import { useEffect, useState } from 'react';
import {
  Heart, Loader2, CheckCircle, CreditCard, ShieldCheck, Lock, Smartphone, Sparkles,
} from 'lucide-react';
import { api } from '@/services/api';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { getRuntimeEnv } from '@/config/runtimeEnv';
import type { DonationType } from '@/services/api';

const { stripeKey } = getRuntimeEnv();
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);
const stripeEnabled = Boolean(stripeKey);

type PaymentMethod = 'mpesa' | 'card';
type Status = 'idle' | 'submitting' | 'success' | 'error';

type DonationFormProps = {
  initialAmount?: number;
  selectionSignal?: number;
  initialPaymentMethod?: PaymentMethod;
};

const CARD_ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: '14px',
      color: '#0f172a',
      fontFamily: '"DM Sans", sans-serif',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
} as const;

const PURPOSES = [
  { value: 'general',    label: 'General Support' },
  { value: 'education',  label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'food',       label: 'Food & Nutrition' },
  { value: 'shelter',    label: 'Shelter' },
];

/* ─── Shared input styles ─────────────────────────────────────────── */
const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-slate-900 placeholder-slate-300 text-sm transition-all';

const selectCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-slate-900 text-sm appearance-none cursor-pointer transition-all';

/* ─── Field wrapper ───────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</label>
      {children}
    </div>
  );
}

/* ─── Left panel: payment method selector ────────────────────────── */
function LeftPanel({
  paymentMethod,
  onMethodChange,
  donationType,
  onDonationTypeChange,
}: {
  paymentMethod: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  donationType: string;
  onDonationTypeChange: (t: string) => void;
}) {
  const methods: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode; activeColor: string; activeBg: string; activeBorder: string; checkBg: string }[] = [
    {
      id: 'mpesa',
      label: 'M-Pesa',
      sub: 'Mobile money · Kenya',
      icon: <Smartphone className="w-5 h-5" />,
      activeColor: 'text-emerald-700',
      activeBg: 'bg-emerald-500',
      activeBorder: 'border-emerald-400',
      checkBg: 'bg-emerald-500',
    },
    {
      id: 'card',
      label: 'Card',
      sub: 'Visa / Mastercard',
      icon: <CreditCard className="w-5 h-5" />,
      activeColor: 'text-orange-700',
      activeBg: 'bg-gradient-to-br from-orange-500 to-pink-500',
      activeBorder: 'border-orange-400',
      checkBg: 'bg-orange-500',
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Branding */}
      <div>
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md shadow-orange-300/40">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-white leading-none">Make a Donation</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Your generosity changes lives</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-700/60 mb-6" />

        {/* Pay with label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">Pay with</p>


        {/* Method tiles */}
        <div className="flex flex-col gap-2.5">
          {methods.map(m => {
            const active = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onMethodChange(m.id)}
                className={`relative flex items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-200 overflow-hidden group ${
                  active
                    ? `${m.activeBorder} bg-white/10`
                    : 'border-slate-700 bg-transparent hover:border-slate-500 hover:bg-white/5'
                }`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  active ? m.activeBg + ' text-white shadow-lg' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                }`}>
                  {m.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-none ${active ? 'text-white' : 'text-slate-300'}`}>{m.label}</p>
                  <p className={`text-[11px] mt-0.5 ${active ? 'text-slate-300' : 'text-slate-500'}`}>{m.sub}</p>
                </div>

                {/* Check */}
                {active && (
                  <div className={`w-5 h-5 rounded-full ${m.checkBg} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Simple PayPal button */}
          <a
            href="https://www.paypal.me/JJRafiki7"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block w-full rounded-2xl border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-center py-3 px-4 text-sm tracking-wide transition-all"
            style={{ minHeight: 44 }}
          >
            Donate with PayPal
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-700/60 my-6" />

        {/* Frequency */}
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">Frequency</p>
        <div className="flex rounded-xl overflow-hidden border border-slate-700">
          {[
            { val: 'one_time', label: 'One-time' },
            { val: 'monthly',  label: 'Monthly'  },
          ].map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => onDonationTypeChange(val)}
              className={`flex-1 py-2.5 text-xs font-bold transition-all ${
                donationType === val
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <Lock className="w-3 h-3" /> SSL encrypted & secure
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3" /> 100% of funds reach children
        </div>
        {paymentMethod === 'card' && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <CheckCircle className="w-3 h-3" /> Powered by Stripe
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────── */
export function DonationForm(props: DonationFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <DonationFormInner {...props} />
    </Elements>
  );
}

function DonationFormInner({ initialAmount, selectionSignal, initialPaymentMethod }: DonationFormProps) {
  const stripe   = useStripe();
  const elements = useElements();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [status, setStatus]               = useState<Status>('idle');
  const [errorMessage, setErrorMessage]   = useState('');
  const [completionMessage, setCompletionMessage] = useState('Your donation was submitted successfully.');

  const [formData, setFormData] = useState({
    donorName:    '',
    donorEmail:   '',
    donorPhone:   '',
    amount:       '',
    donationType: 'one_time',
    purpose:      'general',
    message:      '',
    isAnonymous:  false,
  });

  useEffect(() => {
    if (!initialAmount || initialAmount <= 0) return;
    setFormData(prev => ({ ...prev, amount: String(initialAmount) }));
    setStatus('idle');
  }, [initialAmount, selectionSignal]);

  useEffect(() => {
    if (!initialPaymentMethod) return;
    if (initialPaymentMethod === 'card' && !stripeEnabled) { setPaymentMethod('mpesa'); return; }
    setPaymentMethod(initialPaymentMethod);
  }, [initialPaymentMethod]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (m: PaymentMethod) => {
    setPaymentMethod(m);
    setFormData(p => ({ ...p, amount: '' }));
    setStatus('idle');
    setErrorMessage('');
  };

  const resetForm = () => {
    setFormData({ donorName: '', donorEmail: '', donorPhone: '', amount: '', donationType: 'one_time', purpose: 'general', message: '', isAnonymous: false });
    setPaymentMethod('mpesa');
    setStatus('idle');
    setErrorMessage('');
    setCompletionMessage('Your donation was submitted successfully.');
  };

  const currency = paymentMethod === 'mpesa' ? 'KES' : 'USD';

  // Backend model: MinValueValidator(Decimal('0.01')) — amount is always required
  const amountNum   = parseFloat(formData.amount);
  const amountValid = !isNaN(amountNum) && amountNum >= 0.01;

  const detailsValid =
    amountValid &&
    formData.donorEmail.trim() !== '' &&
    (formData.isAnonymous || formData.donorName.trim() !== '') &&
    (paymentMethod !== 'mpesa' || formData.donorPhone.trim() !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount < 0.01) throw new Error('Please enter a valid donation amount');

      if (paymentMethod === 'mpesa') {
        const response = await api.donations.mpesa({
          donor_name:    formData.donorName,
          donor_email:   formData.donorEmail,
          donor_phone:   formData.donorPhone,
          amount,
          currency:      'KES',
          donation_type: formData.donationType as DonationType,
          purpose:       formData.purpose,
          message:       formData.message,
          is_anonymous:  formData.isAnonymous,
        });
        setCompletionMessage(
          response.status === 'pending' || response.status === 'processing'
            ? response.message || 'An M-Pesa prompt has been sent to your phone. Please complete the payment.'
            : response.message || 'Your M-Pesa donation was completed successfully.'
        );
        setStatus('success');
        return;
      }

      if (paymentMethod === 'card') {
        if (!stripe || !elements) throw new Error('Stripe is not ready yet');
        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) throw new Error('Card element missing');

        const pmResult = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement,
          billing_details: { name: formData.donorName, email: formData.donorEmail },
        });
        if (pmResult.error) throw new Error(pmResult.error.message || 'Unable to create card payment method');

        const intent = await api.donations.stripe({
          donor_name:    formData.donorName,
          donor_email:   formData.donorEmail,
          amount,
          currency:      'USD',
          donation_type: formData.donationType as DonationType,
          purpose:       formData.purpose,
          message:       formData.message,
          is_anonymous:  formData.isAnonymous,
          payment_method_id: pmResult.paymentMethod?.id,
        });

        const confirmation = await stripe.confirmCardPayment(intent.client_secret, {
          payment_method: pmResult.paymentMethod?.id,
        });
        if (confirmation.error) throw new Error(confirmation.error.message || 'Card payment confirmation failed');

        const pi = confirmation.paymentIntent;
        if (!pi) throw new Error('Unable to confirm card payment');
        setCompletionMessage(
          pi.status === 'succeeded'
            ? 'Your card payment was successful. Thank you for your support.'
            : pi.status === 'processing'
            ? 'Your card payment is processing. We will confirm it shortly.'
            : (() => { throw new Error(`Payment status: ${pi.status}`); })()
        );
        setStatus('success');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setStatus('error');
    }
  };

  /* ── Success screen ── */
  if (status === 'success') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 flex flex-col sm:flex-row min-h-[320px]">
          {/* Left accent */}
          <div className="sm:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-xl shadow-orange-900/40 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-extrabold text-xl leading-tight">Thank you!</p>
            <p className="text-slate-400 text-xs mt-1.5">Jambo Rafiki</p>
          </div>
          {/* Right content */}
          <div className="flex-1 bg-white p-8 flex flex-col justify-center">
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{completionMessage}</p>
            {formData.amount && (
              <p className="text-3xl font-extrabold text-orange-500 mb-1">
                {currency} {Number(formData.amount).toLocaleString()}
              </p>
            )}
            <p className="text-xs text-slate-400 mb-6">{PURPOSES.find(p => p.value === formData.purpose)?.label}</p>
            <button
              onClick={resetForm}
              className="w-fit text-sm font-bold text-orange-500 hover:text-orange-600 underline underline-offset-4 transition-colors"
            >
              Make another donation
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form — landscape two-column ── */
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 flex flex-col lg:flex-row">

        {/* ── LEFT: dark panel ── */}
        <div className="lg:w-[38%] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-7 relative overflow-hidden flex-shrink-0">
          {/* decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />
          <div className="relative h-full">
            <LeftPanel
              paymentMethod={paymentMethod}
              onMethodChange={handleMethodChange}
              donationType={formData.donationType}
              onDonationTypeChange={(t) => setFormData(p => ({ ...p, donationType: t }))}
            />
          </div>
        </div>

        {/* ── RIGHT: form fields ── */}
        <div className="flex-1 bg-white p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">

            {/* Section heading */}
            <div className="mb-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Donation details</p>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Tell us about yourself</h3>
            </div>

            {/* Anonymous toggle */}
            <button
              type="button"
              onClick={() => setFormData(p => ({ ...p, isAnonymous: !p.isAnonymous, donorName: !p.isAnonymous ? '' : p.donorName }))}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150 w-full ${
                formData.isAnonymous
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${formData.isAnonymous ? 'bg-orange-500' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${formData.isAnonymous ? 'translate-x-4' : ''}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Donate anonymously</p>
                <p className="text-[10px] text-slate-400">Your name won't be shown publicly</p>
              </div>
            </button>

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!formData.isAnonymous && (
                <Field label="Full name">
                  <input type="text" name="donorName" value={formData.donorName} onChange={handleChange}
                    required={!formData.isAnonymous} placeholder="Jane Doe" className={inputCls} />
                </Field>
              )}
              <Field label="Email address">
                <input type="email" name="donorEmail" value={formData.donorEmail} onChange={handleChange}
                  required placeholder="jane@example.com" className={inputCls} />
              </Field>
            </div>

            {/* M-Pesa phone */}
            {paymentMethod === 'mpesa' && (
              <Field label="M-Pesa number">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-white">
                  <span className="px-3 py-2.5 text-xs font-bold text-slate-400 border-r border-slate-200 bg-slate-50 select-none">+254</span>
                  <input
                    type="tel"
                    name="donorPhone"
                    value={formData.donorPhone.startsWith('254') ? formData.donorPhone.slice(3) : formData.donorPhone}
                    onChange={e => setFormData(p => ({ ...p, donorPhone: '254' + e.target.value.replace(/\D/g, '') }))}
                    required
                    placeholder="7XXXXXXXX"
                    className="flex-1 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-300 outline-none bg-transparent"
                  />
                </div>
              </Field>
            )}

            {/* Purpose + Amount row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Purpose">
                <div className="relative">
                  <select name="purpose" value={formData.purpose} onChange={handleChange} className={selectCls}>
                    {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </Field>

              <Field label={`How much? (${currency})`}>
                <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-all bg-white ${
                  formData.amount && !amountValid
                    ? 'border-red-300 ring-2 ring-red-100'
                    : amountValid
                    ? 'border-emerald-400 ring-2 ring-emerald-50'
                    : 'border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100'
                }`}>
                  <span className="px-3 py-2.5 text-xs font-bold text-slate-400 border-r border-slate-200 bg-slate-50 select-none">{currency}</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0.01"
                    step="any"
                    required
                    placeholder="Enter any amount"
                    className="flex-1 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-300 outline-none bg-transparent"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Give whatever feels right — every shilling helps</p>
              </Field>
            </div>

            {/* Card fields */}
            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-3">
                {!stripeEnabled ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                    Card payments are not configured yet. Please use M-Pesa for now.
                  </div>
                ) : (
                  <>
                    <Field label="Card number">
                      <div className="min-h-[42px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all flex items-center">
                        <CardNumberElement options={CARD_ELEMENT_STYLE} className="w-full" />
                      </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Expiry">
                        <div className="min-h-[42px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all flex items-center">
                          <CardExpiryElement options={CARD_ELEMENT_STYLE} />
                        </div>
                      </Field>
                      <Field label="CVV">
                        <div className="min-h-[42px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all flex items-center">
                          <CardCvcElement options={CARD_ELEMENT_STYLE} />
                        </div>
                      </Field>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* M-Pesa notice */}
            {paymentMethod === 'mpesa' && (
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <Smartphone className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-700">
                  A push notification will be sent to{' '}
                  <span className="font-bold">{formData.donorPhone || 'your M-Pesa number'}</span>{' '}
                  to complete the payment.
                </p>
              </div>
            )}

            {/* Message */}
            <Field label="Message (optional)">
              <textarea name="message" value={formData.message} onChange={handleChange} rows={2}
                placeholder="Share why you're donating…" className={`${inputCls} resize-none`} />
            </Field>

            {/* Error */}
            {status === 'error' && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <div className="mt-auto pt-2">
              <button
                type="submit"
                disabled={status === 'submitting' || !detailsValid}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                ) : (
                  <>
                    <Heart className="w-4 h-4" fill="white" />
                    {amountValid
                      ? `Donate ${currency} ${parseFloat(formData.amount).toLocaleString()}`
                      : 'Enter an amount to continue'}
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}