import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Admin Console</h1>
      <p className="text-sm text-muted-foreground">
        Manage menus, orders, and promos from the dashboard. Use the shortcuts below to jump into a workflow.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/dashboard">Open dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Review orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/menu">Edit menu</Link>
        </Button>
      </div>
    </div>
  );
}
