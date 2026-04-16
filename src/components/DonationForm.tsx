import { useEffect, useState } from 'react';
import {
  Heart, Loader2, Smartphone, CheckCircle, CreditCard, ShieldCheck, Lock,
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
      fontSize: '15px',
      color: '#111827',
      fontFamily: '"DM Sans", sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#dc2626' },
  },
} as const;

const PRESET_AMOUNTS_MPESA = [500, 1000, 2500, 5000, 10000, 25000];
const PRESET_AMOUNTS_CARD = [10, 25, 50, 100, 250, 500];

const PURPOSES = [
  { value: 'general',    label: 'General Support' },
  { value: 'education',  label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'food',       label: 'Food & Nutrition' },
  { value: 'shelter',    label: 'Shelter' },
];

/* ─── Step indicator ──────────────────────────────────────────────── */
function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
          done
            ? 'bg-orange-500 text-white'
            : active
            ? 'bg-white border-2 border-orange-500 text-orange-500'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        {done ? <CheckCircle className="w-4 h-4" /> : n}
      </div>
    </div>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────────── */
function Section({
  step, currentStep, title, children,
}: {
  step: number; currentStep: number; title: string; children: React.ReactNode;
}) {
  const active = step === currentStep;
  const done   = step < currentStep;
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        active
          ? 'border-orange-200 shadow-sm shadow-orange-100'
          : done
          ? 'border-gray-100 bg-gray-50/50'
          : 'border-gray-100 opacity-50 pointer-events-none'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-5 py-3.5 ${
          active ? 'bg-orange-50/60' : 'bg-transparent'
        }`}
      >
        <StepDot n={step} active={active} done={done} />
        <span
          className={`text-sm font-semibold tracking-wide uppercase ${
            active ? 'text-orange-600' : done ? 'text-gray-400' : 'text-gray-300'
          }`}
        >
          {title}
        </span>
      </div>
      {active && <div className="px-5 pb-5 pt-2">{children}</div>}
    </div>
  );
}

/* ─── Field wrapper ───────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-gray-900 placeholder-gray-400 text-sm transition-all disabled:bg-gray-50 disabled:text-gray-400';

const selectCls =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-gray-900 text-sm transition-all appearance-none cursor-pointer';

/* ─── Main export ─────────────────────────────────────────────────── */
export function DonationForm({ initialAmount, selectionSignal, initialPaymentMethod }: DonationFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <DonationFormInner
        initialAmount={initialAmount}
        selectionSignal={selectionSignal}
        initialPaymentMethod={initialPaymentMethod}
      />
    </Elements>
  );
}

function DonationFormInner({ initialAmount, selectionSignal, initialPaymentMethod }: DonationFormProps) {
  const stripe   = useStripe();
  const elements = useElements();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [status, setStatus]               = useState<Status>('idle');
  const [errorMessage, setErrorMessage]   = useState('');
  const [cardStatusMessage, setCardStatusMessage] = useState('Your card donation was submitted successfully.');
  const [currentStep, setCurrentStep]     = useState(1);

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

  /* sync external props */
  useEffect(() => {
    if (!initialAmount || initialAmount <= 0) return;
    setFormData(prev => ({ ...prev, amount: String(initialAmount) }));
    setStatus('idle');
    setErrorMessage('');
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({ donorName: '', donorEmail: '', donorPhone: '', amount: '', donationType: 'one_time', purpose: 'general', message: '', isAnonymous: false });
    setPaymentMethod('mpesa');
    setStatus('idle');
    setErrorMessage('');
    setCardStatusMessage('Your card donation was submitted successfully.');
    setCurrentStep(1);
  };

  /* step nav */
  const goNext = () => setCurrentStep(s => Math.min(s + 1, 3));
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 1));

  const currency    = paymentMethod === 'mpesa' ? 'KES' : 'USD';
  const presets     = paymentMethod === 'mpesa' ? PRESET_AMOUNTS_MPESA : PRESET_AMOUNTS_CARD;
  const amountNum   = Number(formData.amount);
  const amountValid = Number.isFinite(amountNum) && amountNum > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const amount = Number(formData.amount);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a valid donation amount');

      if (paymentMethod === 'mpesa') {
        await api.donations.mpesa({
          donor_name:    formData.donorName,
          donor_email:   formData.donorEmail,
          donor_phone:   formData.donorPhone,
          amount,
          currency:      'KES',
          donation_type: formData.donationType,
          purpose:       formData.purpose,
          message:       formData.message,
          is_anonymous:  formData.isAnonymous,
        });
        setStatus('success');
        return;
      }

      if (paymentMethod === 'card') {
        if (!stripe || !elements) throw new Error('Stripe is not ready yet');
        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) throw new Error('Card element missing');

        const intent = await api.donations.stripe({
          donor_name:    formData.donorName,
          donor_email:   formData.donorEmail,
          amount,
          currency:      'USD',
          donation_type: formData.donationType,
          purpose:       formData.purpose,
          message:       formData.message,
          is_anonymous:  formData.isAnonymous,
        });

        const confirmation = await stripe.confirmCardPayment(intent.client_secret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: { name: formData.donorName, email: formData.donorEmail },
          },
        });

        if (confirmation.error) throw new Error(confirmation.error.message || 'Card payment confirmation failed');

        const pi = confirmation.paymentIntent;
        if (!pi) throw new Error('Unable to confirm card payment');

        if (pi.status === 'succeeded') {
          setCardStatusMessage('Your card payment was successful. Thank you for your support.');
        } else if (pi.status === 'processing') {
          setCardStatusMessage('Your card payment is processing. We will confirm it shortly.');
        } else {
          throw new Error(`Card payment could not be completed (status: ${pi.status})`);
        }
        setStatus('success');
        return;
      }

      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      setStatus('error');
    }
  };

  /* ── Success screen ──────────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="rounded-3xl border border-green-100 bg-green-50 p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
          <p className="text-gray-500 text-sm mb-1">
            {paymentMethod === 'mpesa'
              ? 'An M-Pesa prompt has been sent to your phone. Please complete the payment.'
              : cardStatusMessage}
          </p>
          {formData.amount && (
            <p className="text-3xl font-bold text-orange-500 mt-4 mb-1">
              {currency} {Number(formData.amount).toLocaleString()}
            </p>
          )}
          <p className="text-xs text-gray-400 mb-6">{PURPOSES.find(p => p.value === formData.purpose)?.label}</p>
          <button
            onClick={resetForm}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 underline underline-offset-4 transition-colors"
          >
            Make another donation
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md shadow-orange-200 flex-shrink-0">
          <Heart className="w-6 h-6 text-white" fill="white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">Make a Donation</h2>
          <p className="text-sm text-gray-400 mt-0.5">Your support transforms lives</p>
        </div>
      </div>

      {/* Payment method tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { id: 'mpesa', label: 'M-Pesa', sub: 'Mobile money', Icon: Smartphone },
          { id: 'card',  label: 'Card',   sub: 'Visa / Mastercard', Icon: CreditCard },
        ] as const).map(({ id, label, sub, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setPaymentMethod(id); setCurrentStep(1); setFormData(p => ({ ...p, amount: '' })); }}
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 ${
              paymentMethod === id
                ? 'border-orange-400 bg-orange-50 shadow-sm shadow-orange-100'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${paymentMethod === id ? 'text-orange-500' : 'text-gray-400'}`} />
            <div className="text-left">
              <p className={`text-sm font-semibold leading-tight ${paymentMethod === id ? 'text-orange-600' : 'text-gray-700'}`}>{label}</p>
              <p className="text-xs text-gray-400 hidden sm:block">{sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Steps */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* ── Step 1: Amount & frequency ── */}
        <Section step={1} currentStep={currentStep} title="Amount & Frequency">
          {/* Frequency */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
            {[
              { val: 'one_time', label: 'One-time' },
              { val: 'monthly',  label: 'Monthly'  },
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                onClick={() => setFormData(p => ({ ...p, donationType: val }))}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  formData.donationType === val
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Preset amounts */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {presets.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setFormData(p => ({ ...p, amount: String(amt) }))}
                className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  formData.amount === String(amt)
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {currency} {amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-white">
            <span className="px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-200 bg-gray-50 select-none">{currency}</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              placeholder="Enter custom amount"
              className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>

          {/* Purpose */}
          <div className="mt-4">
            <Field label="Purpose">
              <div className="relative">
                <select name="purpose" value={formData.purpose} onChange={handleChange} className={selectCls}>
                  {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </Field>
          </div>

          <button
            type="button"
            disabled={!amountValid}
            onClick={goNext}
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            Continue
          </button>
        </Section>

        {/* ── Step 2: Donor details ── */}
        <Section step={2} currentStep={currentStep} title="Your Details">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <div
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${formData.isAnonymous ? 'bg-orange-500' : 'bg-gray-200'}`}
                onClick={() => setFormData(p => ({ ...p, isAnonymous: !p.isAnonymous, donorName: !p.isAnonymous ? '' : p.donorName }))}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.isAnonymous ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Donate anonymously</p>
                <p className="text-xs text-gray-400">Your name won't be publicly shown</p>
              </div>
            </label>

            {!formData.isAnonymous && (
              <Field label="Full name">
                <input type="text" name="donorName" value={formData.donorName} onChange={handleChange} required={!formData.isAnonymous} placeholder="Jane Doe" className={inputCls} />
              </Field>
            )}

            <Field label="Email address">
              <input type="email" name="donorEmail" value={formData.donorEmail} onChange={handleChange} required placeholder="jane@example.com" className={inputCls} />
            </Field>

            {paymentMethod === 'mpesa' && (
              <Field label="M-Pesa phone number">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-white">
                  <span className="px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-200 bg-gray-50 select-none whitespace-nowrap">+254</span>
                  <input
                    type="tel"
                    name="donorPhone"
                    value={formData.donorPhone.startsWith('254') ? formData.donorPhone.slice(3) : formData.donorPhone}
                    onChange={e => setFormData(p => ({ ...p, donorPhone: '254' + e.target.value.replace(/\D/g, '') }))}
                    required
                    placeholder="7XXXXXXXX"
                    className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
              </Field>
            )}

            <Field label="Message (optional)">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Share why you're donating…"
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>

          <div className="flex gap-2 mt-5">
            <button type="button" onClick={goBack} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!formData.donorEmail || (!formData.isAnonymous && !formData.donorName) || (paymentMethod === 'mpesa' && !formData.donorPhone)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              Continue to Payment
            </button>
          </div>
        </Section>

        {/* ── Step 3: Payment ── */}
        <Section step={3} currentStep={currentStep} title="Payment">
          {/* Summary pill */}
          <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-5">
            <div>
              <p className="text-xs text-orange-400 font-medium uppercase tracking-wider">Donating</p>
              <p className="text-xl font-bold text-orange-600">{currency} {Number(formData.amount).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{formData.donationType === 'one_time' ? 'One-time' : 'Monthly'}</p>
              <p className="text-xs text-gray-500">{PURPOSES.find(p => p.value === formData.purpose)?.label}</p>
            </div>
          </div>

          {/* Card payment fields */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-5">
              {!stripeEnabled && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Card payments are not configured yet. Please use M-Pesa for now.
                </div>
              )}
              {stripeEnabled && (
                <>
                  <Field label="Card number">
                    <div className="min-h-[46px] px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all flex items-center">
                      <CardNumberElement options={CARD_ELEMENT_STYLE} className="w-full" />
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiry date">
                      <div className="min-h-[46px] px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all flex items-center">
                        <CardExpiryElement options={CARD_ELEMENT_STYLE} />
                      </div>
                    </Field>
                    <Field label="CVV">
                      <div className="min-h-[46px] px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all flex items-center">
                        <CardCvcElement options={CARD_ELEMENT_STYLE} />
                      </div>
                    </Field>
                  </div>
                </>
              )}
            </div>
          )}

          {/* M-Pesa reminder */}
          {paymentMethod === 'mpesa' && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
              <Smartphone className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">
                You'll receive a push notification on <span className="font-semibold">{formData.donorPhone || 'your M-Pesa number'}</span> to complete the payment.
              </p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={goBack} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                <><Heart className="w-4 h-4" fill="white" /> Donate {currency} {Number(formData.amount).toLocaleString()}</>
              )}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-gray-100">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="w-3 h-3" /> SSL encrypted
            </span>
            {paymentMethod === 'card' && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck className="w-3 h-3" /> Powered by Stripe
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle className="w-3 h-3" /> 100% secure
            </span>
          </div>
        </Section>

      </form>
    </div>
  );
}