import { Landmark, Copy } from 'lucide-react';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

export function BankTransferSection() {
  const { organization } = useOrganizationConfig();
  const { bank_account: bankAccount } = organization;

  const hasBankDetails = Boolean(
    bankAccount.account_name || bankAccount.account_number || bankAccount.bank_code || bankAccount.branch_code || bankAccount.swift_code,
  );

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Landmark className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">Bank Details</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Donation account information</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                These details are sourced from the backend organization config. M-Pesa and card donations remain the primary online options.
              </p>

              {hasBankDetails ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <InfoCard label="Account Name" value={bankAccount.account_name} />
                  <InfoCard label="Account Number" value={bankAccount.account_number} />
                  <InfoCard label="Bank Code" value={bankAccount.bank_code} />
                  <InfoCard label="Branch Code" value={bankAccount.branch_code} />
                  <InfoCard label="SWIFT Code" value={bankAccount.swift_code} />
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                  Bank transfer details are not available yet. Please use the contact options below if you need assistance.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{value || 'Not set'}</p>
        </div>
        <Copy className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}
