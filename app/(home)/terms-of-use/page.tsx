export default function TermsPage() {
  return (
    <div className="container space-y-4 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</p>
        <h1 className="font-display text-3xl font-bold">Terms of Use</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        By using Holygrill you agree to place genuine orders, provide accurate delivery details, and treat riders and
        staff with respect. Menu pricing may change without notice. Refunds are handled on a case-by-case basis when an
        order is incorrect or delayed beyond reasonable delivery windows.
      </p>
      <p className="text-sm text-muted-foreground">
        Holy Points are promotional and can change or expire. Misuse of promotions or attempts to game the system may
        result in account suspension. Continued use of the platform constitutes acceptance of any updated terms.
      </p>
    </div>
  );
}
