// BankTransferSection.tsx
import { useState } from 'react';
import { Landmark, Copy, CheckCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

type CopiedKey = string | null;

function InfoCard({
  label,
  value,
  copiedKey,
  onCopy,
}: {
  label: string;
  value: string | null | undefined;
  copiedKey: CopiedKey;
  onCopy: (key: string, value: string) => void;
}) {
  const displayValue = value?.trim() || null;
  const isCopied = copiedKey === label;

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-4 transition-all duration-200 ${
        displayValue
          ? 'border-slate-200 hover:border-orange-200 hover:shadow-md hover:shadow-orange-50'
          : 'border-dashed border-slate-200 opacity-50'
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p
        className={`mt-1.5 font-mono text-[15px] font-semibold leading-snug ${
          displayValue ? 'text-slate-900' : 'text-slate-400 italic'
        }`}
      >
        {displayValue ?? 'Not configured'}
      </p>

      {displayValue && (
        <button
          type="button"
          aria-label={`Copy ${label}`}
          onClick={() => onCopy(label, displayValue)}
          className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-150 ${
            isCopied
              ? 'border-green-200 bg-green-50 text-green-600'
              : 'border-slate-200 bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500'
          }`}
        >
          {isCopied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}

export function BankTransferSection() {
  const { organization } = useOrganizationConfig();
  const bankAccount = organization?.bank_account ?? {};
  const [copiedKey, setCopiedKey] = useState<CopiedKey>(null);

  const fields: { label: string; value: string | null | undefined }[] = [
    { label: 'Account Name',   value: bankAccount.account_name },
    { label: 'Account Number', value: bankAccount.account_number },
    { label: 'Bank Code',      value: bankAccount.bank_code },
    { label: 'Branch Code',    value: bankAccount.branch_code },
    { label: 'SWIFT / BIC',   value: bankAccount.swift_code },
  ];

  const hasBankDetails = fields.some(f => f.value?.trim());

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // clipboard not available — silently ignore
    }
  };

  return (
    <section className="border-y border-slate-100 bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Card shell */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Header band */}
          <div className="flex items-start gap-5 border-b border-slate-100 px-8 py-7">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 ring-1 ring-orange-100">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">
                Wire Transfer
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Bank Account Details</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                Transfer directly to our account. Please email{' '}
                <a
                  href="mailto:info@jamborafiki.org"
                  className="font-medium text-orange-500 hover:underline"
                >
                  info@jamborafiki.org
                </a>{' '}
                with your transfer reference so we can acknowledge your donation.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            {hasBankDetails ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fields.map(f => (
                    <InfoCard
                      key={f.label}
                      label={f.label}
                      value={f.value}
                      copiedKey={copiedKey}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
                <p className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCheck className="h-3.5 w-3.5 text-green-400" />
                  Click any field to copy the value to your clipboard.
                </p>
              </>
            ) : (
              <div className="flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <p className="text-sm text-slate-500">
                  Bank transfer details haven't been configured yet. Please use M-Pesa, card, or
                  PayPal to complete your donation, or{' '}
                  <a href="/contact" className="font-medium text-orange-500 hover:underline">
                    contact us
                  </a>{' '}
                  for wire transfer instructions.
                </p>
              </div>
            )}
          </div>

          {/* PayPal strip */}
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-8 py-4">
            <div className="flex items-center gap-2.5">
              {/* PayPal wordmark using SVG so no external image needed */}
              <svg viewBox="0 0 101 32" className="h-5" aria-label="PayPal" fill="none">
                <path
                  d="M12.237 2.898H6.002a.839.839 0 0 0-.83.71L2.766 19.932a.504.504 0 0 0 .498.582h2.985c.41 0 .76-.298.823-.704l.657-4.166a.838.838 0 0 1 .828-.704h1.96c4.08 0 6.434-1.975 7.049-5.888.278-1.71.011-3.055-.793-3.997-.883-1.034-2.45-1.157-4.536-1.157zm.714 5.804c-.338 2.22-2.035 2.22-3.677 2.22h-.934l.655-4.148a.503.503 0 0 1 .497-.424h.429c1.117 0 2.172 0 2.717.636.325.38.424.946.313 1.716zM33.305 8.598h-3.003a.502.502 0 0 0-.497.424l-.128.809-.202-.293c-.625-.907-2.018-1.21-3.408-1.21-3.188 0-5.913 2.415-6.444 5.804-.277 1.69.116 3.306 1.076 4.43.88.036 1.787 1.476 2.978 1.476 2.574 0 4.003-1.654 4.003-1.654l-.13.804a.503.503 0 0 0 .497.583h2.706c.411 0 .76-.298.824-.704l1.624-10.286a.503.503 0 0 0-.496-.583zm-4.19 5.618c-.28 1.654-1.597 2.766-3.27 2.766-.842 0-1.517-.271-1.949-.783-.43-.51-.593-1.234-.456-2.04.262-1.64 1.6-2.786 3.246-2.786.824 0 1.494.273 1.934.791.441.522.617 1.252.495 2.052zM50.43 8.598h-3.023a.84.84 0 0 0-.694.369l-4.008 5.9-1.7-5.67a.839.839 0 0 0-.804-.599h-2.97a.504.504 0 0 0-.478.668l3.2 9.393-3.009 4.249a.504.504 0 0 0 .41.797h3.02a.84.84 0 0 0 .69-.363l9.665-13.946a.504.504 0 0 0-.299-.798z"
                  fill="#253B80"
                />
                <path
                  d="M60.046 2.898h-6.236a.839.839 0 0 0-.83.71L50.574 19.932a.504.504 0 0 0 .498.582h3.202c.288 0 .533-.209.578-.495l.69-4.375a.838.838 0 0 1 .829-.704h1.96c4.08 0 6.433-1.975 7.048-5.888.279-1.71.012-3.055-.792-3.997-.883-1.034-2.45-1.157-4.541-1.157zm.714 5.804c-.338 2.22-2.035 2.22-3.677 2.22h-.933l.654-4.148a.503.503 0 0 1 .497-.424h.43c1.117 0 2.172 0 2.716.636.325.38.424.946.313 1.716zM81.115 8.598h-3.001a.502.502 0 0 0-.498.424l-.128.809-.203-.293c-.624-.907-2.017-1.21-3.407-1.21-3.188 0-5.912 2.415-6.444 5.804-.276 1.69.117 3.306 1.077 4.43.88.036 1.787 1.476 2.978 1.476 2.574 0 4.003-1.654 4.003-1.654l-.13.804a.503.503 0 0 0 .497.583h2.706c.41 0 .76-.298.823-.704l1.625-10.286a.503.503 0 0 0-.498-.583zm-4.19 5.618c-.28 1.654-1.596 2.766-3.27 2.766-.841 0-1.516-.271-1.948-.783-.431-.51-.593-1.234-.456-2.04.262-1.64 1.6-2.786 3.245-2.786.825 0 1.494.273 1.934.791.442.522.618 1.252.496 2.052zM84.096 3.27l-2.45 15.587-.026.157c.047.282.29.49.578.49h2.585a.839.839 0 0 0 .83-.71l2.406-15.266a.504.504 0 0 0-.498-.582h-2.927a.502.502 0 0 0-.498.323z"
                  fill="#179BD7"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold text-slate-700">PayPal accepted</p>
                <p className="text-[10px] text-slate-400">Send to @JJRafiki7</p>
              </div>
            </div>
            <a
              href="https://www.paypal.me/JJRafiki7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0070BA] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#005EA6] hover:shadow-md"
            >
              Pay with PayPal <ExternalLink className="h-3 w-3" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}