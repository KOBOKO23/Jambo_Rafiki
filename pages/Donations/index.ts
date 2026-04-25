// pages/Donations/index.ts
//
// Barrel file for the Donations page folder.
//
// ✅ IMPORTANT: All exports here are NAMED exports.
//    This is what makes the lazy() pattern in App.tsx work:
//
//      lazy(() => import('./pages/Donations').then(m => ({ default: m.DonationPage })))
//
//    React.lazy needs the promise to resolve to { default: Component }.
//    The .then() call above plucks the named export and puts it on `default`.
//
// ⚠️  Do NOT use `export default` anywhere in this barrel — named exports only.

export * from './DonationPage';       // exports: DonationPage
export * from './HeroSection';        // exports: HeroSection
export * from './ImpactStats';        // exports: ImpactStats
export * from './TrustIndicators';    // exports: TrustIndicators
export * from './BankTransferSection'; // exports: BankTransferSection
export * from './FinalCTA';           // exports: FinalCTA
export * from './SponsorshipSectionWrapper'; // exports: SponsorshipSectionWrapper
// DonationFormSection uses a default export internally — import it directly if needed:
// import DonationFormSection from './DonationFormSection';