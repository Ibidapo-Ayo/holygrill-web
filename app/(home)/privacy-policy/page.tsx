export default function PrivacyPolicyPage() {
  return (
    <div className="container space-y-4 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</p>
        <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        We collect only the data needed to process orders, deliver your food, and improve the Holygrill experience. This
        includes contact information, delivery details, and order history. Payment information is processed securely by
        our payment partners and never stored on our servers.
      </p>
      <p className="text-sm text-muted-foreground">
        You can request data deletion or account removal at any time by contacting support. Cookies are used to keep you
        signed in and personalize your experience. We do not sell or rent personal data to third parties.
      </p>
    </div>
  );
}
